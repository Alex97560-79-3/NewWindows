
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
    if (!aiInstance) {
        let apiKey = '';
        try {
            // Safe access for process.env
            // @ts-ignore
            if (typeof process !== 'undefined' && process && process.env && process.env.API_KEY) {
                // @ts-ignore
                apiKey = process.env.API_KEY;
            }
        } catch (e) {
            console.warn("Could not access process.env.API_KEY, using empty key.", e);
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

export const getWindowAssistantChat = (): Chat => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Вы профессиональный консультант магазина "Новые Окна". 
      Ваша цель — помочь клиентам выбрать подходящие окна исходя из их потребностей (теплоизоляция, шумоподавление, стиль, бюджет).
      Будьте вежливы, профессиональны и кратки.
      Если вас спрашивают о технических деталях (U-value, камеры), объясняйте простым языком.
      Мы продаем окна из: ПВХ (Винил), Дерева и Алюминия.
      Категории: Одностворчатые, Распашные, Раздвижные.
      Не придумывайте конкретные цены, если они не указаны в контексте, используйте примерные диапазоны.
      Всегда старайтесь направить клиента в наш каталог. Отвечайте на русском языке.`,
    },
  });
};

export const generateMarketingDescription = async (product: Partial<Product>): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `Напиши привлекательное, SEO-оптимизированное маркетинговое описание (максимум 50 слов) на русском языке для окна с такими характеристиками:
    Название: ${product.name}
    Материал: ${product.frameMaterial}
    Тип стекла: ${product.glassType}
    Особенности: ${product.chambersCount} камер.
    Целевая аудитория: Домовладельцы, ищущие качество и эффективность.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Описание недоступно.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Не удалось сгенерировать описание.";
  }
};
