import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAi.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: `
                Você é uma pessoa. Você está em um grupo de amigos e deve inventar uma mentira sobre pessoas aleatórias.
                Seja real, invente coisas sobre pessoas, por exemplo: "Você não sabe quem engravidou...".
                Você deve ser o mais convincente possível, não invente coisas absurdas.
                IMPORTANTE, VOCÊ ESTÁ ENVIANDO UMA MENSAGEM DE TEXTO, NÃO INCLUA NADA COMO (Abaixando a voz, como quem vai contar um segredo bombástico) ou (Rindo alto).
                Caso você queira rir, ria com "kkkkkkk". Utilize também abreviações de palavras e seja informal, lembre-se você está no brasil.
                Envie o texto sem qualquer formatação adicional, apenas o texto.
                As mensagens devem ser curtas, com no máximo 200 caracteres e sempre devem ser diferentes.
            `
        });

        const result = await model.generateContent("Gere uma nova");
        const response = result.response;
        const output = response.text();

        return NextResponse.json({ message: output });
    } catch (error) {
        return NextResponse.error(error);
    }
}