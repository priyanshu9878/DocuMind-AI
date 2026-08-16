import * as dotenv from 'dotenv';
dotenv.config(); 
import readlineSync from 'readline-sync';
import { Pinecone } from '@pinecone-database/pinecone';

// for results+ query==> Step 3: Query + Context to LLM

import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';


// config ==>  Step 1: Convert the user query into embedding(vector)
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_PAID_API_KEY,
    model: "gemini-embedding-001",
    });
// cinfig with pinecone
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);



async function chatting(question) {

    // creating embedding for question (1)
    const queryVector = await embeddings.embedQuery(question);   


    // searching embedding in pinecone and bring top k results (2)
    const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
    });

    //console.log(searchResults);
    const context = searchResults.matches
                   .map(match => match.metadata.text)
                   .join("\n\n---\n\n");
        
    //  (3) Step 3: Query + Context to LLM

    const model = new ChatGoogleGenerativeAI({
                       apiKey: process.env.GEMINI_PAID_API_KEY,
                       model: 'gemini-2.5-flash',  
                       temperature: 0.3, 
                    });

                    // give top K results + question to LLM  
                    //  // Step 4: Create a prompt template
                     const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful assistant answering questions based on the provided documentation.

Context from the documentation:
{context}

Question: {question}

Instructions:
- Answer the question using ONLY the information from the context above
- If the answer is not in the context, say "I don't have enough information to answer that question."
- Be concise and clear
- Use code examples from the context if relevant

Answer:
        `);



                   // LLM'll create output
                   //  Step 5: Create a chain (prompt → model → parser)
                    const chain = RunnableSequence.from([
                       promptTemplate,
                       model,
                       new StringOutputParser(),
        ]);

                // Step 6: Invoke the chain and get the answer
                // calling LLM
        const answer = await chain.invoke({
            context: context,
            question: question,
        }); 

        console.log(answer);

}

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}


main();