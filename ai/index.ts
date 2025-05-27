"use server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

export async function translateText(text: string) {
  try {
    const llm = new ChatOpenAI({ model: "z", temperature: 0 });

    const taggingPrompt =
      ChatPromptTemplate.fromTemplate(`Extract the desired information from the following passage.

Only extract the properties mentioned in the 'Classification' function.

Passage:
{input}`);

    const classificationSchema2 = z.object({
      sentiment: z
        .enum(["happy", "neutral", "sad"])
        .describe("The sentiment of the text"),
      aggressiveness: z
        .number()
        .int()
        .describe(
          "describes how aggressive the statement is on a scale from 1 to 5. The higher the number the more aggressive"
        ),
      language: z
        .enum(["spanish", "english", "french", "german", "italian"])
        .describe("The language the text is written in"),
    });

    const llmWithStructuredOutput = llm.withStructuredOutput(
      classificationSchema2,
      {
        name: "extractor",
      }
    );

    const prompt1 = await taggingPrompt.invoke({
      input: text,
    });

    const result = await llmWithStructuredOutput.invoke(prompt1);

    console.log("Result:", result);
    // const systemTemplete =
    //   "Translate the following from English into {language}";

    // const promptTemplate = ChatPromptTemplate.fromMessages([
    //   ["system", systemTemplete],
    //   ["user", "{text}"],
    // ]);

    // const promptValue = await promptTemplate.invoke({
    //   language: "sanskrit",
    //   text: text,
    // });
    // const messages = [
    //   new SystemMessage("Translate the following from English into Hindi"),
    //   new HumanMessage(text || "hi!"),
    // ];

    // const result = await model.invoke(promptValue.toChatMessages());

    return result;
  } catch (error) {
    console.error("Translation error:", error);
    return { error: "Failed to translate text" };
  }
}
