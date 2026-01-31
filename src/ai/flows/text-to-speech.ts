'use server';
/**
 * @fileOverview A Genkit flow that converts text to speech.
 *
 * - textToSpeech - A function that converts text to speech.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';
import wav from 'wav';

export async function textToSpeech(text: string, lang: string = 'ur-PK'): Promise<{media: string}> {
  return textToSpeechFlow({text, lang});
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.object({text: z.string(), lang: z.string()}),
    outputSchema: z.object({media: z.string()}),
  },
  async ({text, lang}) => {
    // Define specific, high-quality voices for supported languages to ensure reliability.
    const voiceMap: {[key: string]: string} = {
      'ur-PK': 'ur-PK-Standard-A', // Urdu (Pakistan)
      'pa-IN': 'pa-IN-Wavenet-A',  // Punjabi (India)
      'sd-IN': 'sd-IN-Standard-A', // Sindhi (India)
    };

    let speechConfig: any = {
      languageCode: lang,
    };

    // Use a specific prebuilt voice if one is mapped for the selected language.
    if (voiceMap[lang]) {
      speechConfig.voiceConfig = {
        prebuiltVoiceConfig: {voiceName: voiceMap[lang]},
      };
    }
    // For languages without a mapped voice (like Pashto), we rely on the language code alone.

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: speechConfig,
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
