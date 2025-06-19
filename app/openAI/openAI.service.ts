import OpenAI from "openai";
import fs from "fs";
import { DOMParser } from '@xmldom/xmldom';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import textract from 'textract';
import { promisify } from 'util'

const configuration = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

type TextractAsync = (buffer: Buffer, mimeType: string) => Promise<string>;
const textractFromBufferAsync = promisify((buffer: Buffer, mimeType: string, callback: (error: Error | null, text?: string) => void) => {
  textract.fromBufferWithMime(mimeType, buffer, callback);
}) as TextractAsync;

export const generateQuestions = async (
  file: Express.Multer.File,
  noOfQuestions: number
) => {
  try {
    let fileContent: string = '';
    const dataBuffer = fs.readFileSync(file.path);

    // Handle different file types
    switch (file.mimetype) {
      case 'application/pdf':
        const pdfData = await pdf(dataBuffer);
        fileContent = pdfData.text;
        break;

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        fileContent = result.value;
        break;

      case 'application/msword':
        // Now properly typed with the TextractAsync type
        fileContent = await textractFromBufferAsync(dataBuffer, file.mimetype);
        break;

      case 'text/xml':
      case 'application/xml':
        const xmlContent = dataBuffer.toString('utf-8');
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlContent, 'text/xml');
        const documentContent = doc.getElementsByTagName('document_content')[0];
        fileContent = documentContent ? documentContent.textContent || '' : '';
        break;

      case 'text/plain':
        fileContent = dataBuffer.toString('utf-8');
        break;

      default:
        throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    // Clean and validate content
    fileContent = fileContent
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
      .replace(/^\uFEFF/, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    if (!fileContent || fileContent.length === 0) {
      throw new Error('Unable to extract text content from the file');
    }

    const prompt = `You are an expert interviewer tasked with generating targeted interview questions.

      INSTRUCTIONS:
      - Analyze the provided document (could be resume or job description)
      - Identify document type (resume/job description) and role type
      - Extract key skills, qualifications, and requirements
      - For resumes: Focus on candidate's experience and claimed skills
      - For job descriptions: Focus on required qualifications and responsibilities

      QUESTION GENERATION RULES:
      - Generate EXACTLY ${noOfQuestions} questions that:
        1. Are numbered sequentially (1., 2., etc.)
        2. Maximum 15 words per question
        3. Directly relate to skills/experience mentioned in the document
        4. Mix of behavioral and skill-based questions
        5. No introductory text or explanations

      QUESTION TYPES TO INCLUDE:
      - Experience verification questions
      - Skill assessment questions
      - Situation handling questions
      - Knowledge testing questions
      - Role-specific technical questions (if applicable)

      DOCUMENT CONTENT:
      ${fileContent}

      REQUIRED OUTPUT FORMAT:
      1. [Question one]
      2. [Question two]
      ...`;

    const completion = await configuration.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const response: string = completion.choices[0]?.message?.content || "";
    const questions: string[] = response
      .split("\n")
      .filter((line: string): boolean => line.trim().length > 0)
      .map((question: string): string => question.trim());

    fs.unlinkSync(file.path);

    return {
      questions,
      totalQuestions: questions.length,
    };
  } catch (error: any) {
    console.log(error, "error");
    console.log(error?.message, "message");
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }
    if (error?.message.includes("string too long")) {
      throw new Error("This file cannot be uploaded");
    }
    throw error;
  }
};
