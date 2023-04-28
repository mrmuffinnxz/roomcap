import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next/types";

type Data = {
  analysis: string;
  suggestion: string;
};
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
    theory: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const { imageUrl, theory } = req.body;
  let startResponse = await axios.post(
    "https://api.replicate.com/v1/predictions",
    {
      version:
        "c1f0352f9da298ac874159e350d6d78139e3805b7e55f5df7c5b79a66ae19528",
      input: {
        image: imageUrl,
        // message: "Describe the image in a very detailed way",
        num_beams: 1,
      },
    },
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      },
    }
  );

  let jsonStartResponse = await startResponse.data;
  let endpointUrl = jsonStartResponse.urls.get;

  let caption = "";
  while (!caption) {
    let finalResponse = await axios.get(endpointUrl, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      },
    });
    let jsonFinalResponse = await finalResponse.data;

    if (jsonFinalResponse.status === "succeeded") {
      caption = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  console.log("caption:", caption);

  const prompt =
    theory === "7-elements"
      ? `Write a property room analysis description using "7 elements of interior design" rules in bullet point for each element\n\ndescription: ${caption}\n\nlisting:`
      : `Write a property room analysis description using "Feng Shui" rules rules in detailed\n\ndescription: ${caption}\n\nlisting:`;

  const analysis_resp = await axios.post(
    "https://api.ai21.com/studio/v1/j2-jumbo-instruct/complete",
    {
      prompt,
      numResults: 1,
      maxTokens: 1000,
      temperature: 1,
      topKReturn: 0,
      topP: 1,
      countPenalty: {
        scale: 0,
        applyToNumbers: false,
        applyToPunctuations: false,
        applyToStopwords: false,
        applyToWhitespaces: false,
        applyToEmojis: false,
      },
      frequencyPenalty: {
        scale: 0,
        applyToNumbers: false,
        applyToPunctuations: false,
        applyToStopwords: false,
        applyToWhitespaces: false,
        applyToEmojis: false,
      },
      presencePenalty: {
        scale: 0,
        applyToNumbers: false,
        applyToPunctuations: false,
        applyToStopwords: false,
        applyToWhitespaces: false,
        applyToEmojis: false,
      },
      stopSequences: [],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AI21_API_KEY}`,
      },
    }
  );
  const analysis = analysis_resp.data.completions[0].data.text;
  console.log("analysis:", analysis);

  const prompt2 =
    theory === "7-elements"
      ? `${
          prompt + "\n\n" + analysis
        }\n\nWrite room improvement suggestions based on the information above in a specific detailed, bullet-point format, with long reasoning explanation\n\nsuggestion:`
      : `${
          prompt + "\n\n" + analysis
        }\n\nWrite room improvement suggestions based on the information above in a specific detailed, bullet-point format, with long reasoning explanation\n\nsuggestion:`;

  const suggestion_resp = await axios.post(
    "https://api.ai21.com/studio/v1/j2-jumbo-instruct/complete",
    {
      prompt: prompt2,
      numResults: 1,
      maxTokens: 1000,
      temperature: 1,
      topKReturn: 0,
      topP: 1,
      countPenalty: {
        scale: 0,
        applyToNumbers: false,
        applyToPunctuations: false,
        applyToStopwords: false,
        applyToWhitespaces: false,
        applyToEmojis: false,
      },
      frequencyPenalty: {
        scale: 0,
        applyToNumbers: false,
        applyToPunctuations: false,
        applyToStopwords: false,
        applyToWhitespaces: false,
        applyToEmojis: false,
      },
      presencePenalty: {
        scale: 0,
        applyToNumbers: false,
        applyToPunctuations: false,
        applyToStopwords: false,
        applyToWhitespaces: false,
        applyToEmojis: false,
      },
      stopSequences: [],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AI21_API_KEY}`,
      },
    }
  );
  const suggestion = suggestion_resp.data.completions[0].data.text;
  console.log("suggestion:", suggestion);

  res.status(200).json(
    analysis && suggestion
      ? {
          analysis,
          suggestion,
        }
      : {
          analysis: "Something went wrong, please try again.",
          suggestion: "Something went wrong, please try again.",
        }
  );
}
