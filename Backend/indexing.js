import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'; 
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

dotenv.config();


export async function indexing(PDF_PATH,userId,fileName) {
    // Look for the file in the parent directory (..), where you indicated it exists
   
    // 1. Loading
    // const PDF_PATH = './node_js_genai.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    // 2. Chunking
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    // 3. Embedding (Explicitly set dimensionality to match Pinecone)
    // 3. Embedding (Updated)
    // 3. Embedding (Use gemini-embedding-001 for 768 dimensions)
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_PAID_API_KEY,
    model: "gemini-embedding-001", 
});

    // 4. Pinecone Initialisation
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME); 

//console.log("Embedding length:", testEmbedding.length);
//console.log(testEmbedding.slice(0, 5));

    // Adding metadata to each chunked document
    chunkedDocs.forEach((doc) => {
  doc.metadata.userId = userId;
  doc.metadata.fileName = fileName;
  doc.metadata.source = PDF_PATH;
});

    // 5. Upserting to Database
   // console.log("Uploading to Pinecone...");
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });
    console.log("Indexing complete!");
    console.log("INDEXING FUNCTION FINISHED");
}

//indexing().catch(console.error); 