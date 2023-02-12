import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

export default function App() {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // get environment variables
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // API config
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const generateResponse = async (event) => {
    const select = event.target[0].value;
    const topic = event.target[1].value;
    const gist = event.target[2].value;
    const prompt = `用中文寫作，透過${select},以${topic}為題,帶出${gist}：`;
    // const prompt = `貪的詞義是什麼？`;
    console.log(select, topic, gist);
    setLoading(true);
    try {
      // const completion = await openai.createCompletion({
      //   model: "text-davinci-003",
      //   prompt: prompt,  // \n\n###\n\n is a stop sequence recognised by gpt-3
      //   max_tokens: 1024,
      // });
      // temperature: 0.7,
      // n: 1,
      // stop: OPENAI_STOP_WORD,

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(OPENAI_API_KEY),
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 2000,
          // 'temperature': 0.1,
          // 'max_tokens': Math.floor(fileLength/2),
          // 'top_p': 1,
          // 'frequency_penalty': 0,
          // 'presence_penalty': 0.5,
          // 'stop': ["\"\"\""],
        }),
      };
      const body = await fetch(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        requestOptions
      );
      // .then(response => response.json())

      const completion = await body.json();
      console.log(completion);
      const response = completion.choices[0].text;
      // Debugging
      console.log("=====");
      console.log(`Response:\n${response}`);
      console.log("=====");
      return response;
    } catch (e) {}
    return null;
  };

  return (
    <>
      <main className="container-fluid">
        <h2>Chinese Writing Wizard</h2>
        <p>
          巫筆(Chinese Writing Wizard)
          是一個透過AI技術自動產生中文寫作範文的教學輔助工具。教師只需輸入寫作題目、學習目標、學生年級，便能製作出最適合學生程度和課程要求的範文，令中文教學更便捷、更有效。此外，巫筆能就寫作題目產生審題提示、寫作建議，讓學生掌握「怎樣寫」和「寫什麼」，促進寫作能力，改善成績。
        </p>
        <div className="grid">
          <div className="container">
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                //call gpt 3

                const response = await generateResponse(event);

                setLoading(false);
                if (response) {
                  setResult((pre) => {
                    return [...pre, response];
                  });
                }
              }}
            >
              學習重點:
              <div className="grid">
                <select>
                  <option value="" disabled>
                    學習重點
                  </option>
                  <option value="動態描寫">動態描寫</option>
                  <option value="靜態描寫">靜態描寫</option>
                  <option value="白描法">白描法</option>
                  <option value="細描法">細描法</option>
                  <option value="定點描寫">定點描寫</option>
                  <option value="感官描寫">感官描寫</option>
                  <option value="視覺描寫">視覺描寫</option>
                  <option value="聽覺描寫">聽覺描寫</option>
                  <option value="觸覺描寫">觸覺描寫</option>
                  <option value="味覺描寫">味覺描寫</option>
                  <option value="嗅覺描寫">嗅覺描寫</option>
                  <option value="肖像描寫">肖像描寫</option>
                  <option value="心理描寫">心理描寫</option>
                  <option value="行動描寫">行動描寫</option>
                  <option value="語言描寫">語言描寫</option>
                  <option value="神態描寫">神態描寫</option>
                  <option value="襯托">襯托</option>
                  <option value="環境烘托">環境烘托</option>
                  <option value="人物烘托">人物烘托</option>
                  <option value="比喻（明喻、暗喻、借喻）">
                    比喻（明喻、暗喻、借喻）
                  </option>
                  <option value="擬人">擬人</option>
                  <option value="反覆">反覆</option>
                  <option value="呼吿">呼吿</option>
                  <option value="誇張">誇張</option>
                  <option value="聯想">聯想</option>
                  <option value="排比">排比</option>
                  <option value="對比">對比</option>
                  <option value="對偶">對偶</option>
                  <option value="互文">互文</option>
                  <option value="頂真">頂真</option>
                  <option value="象徵">象徵</option>
                  <option value="設問">設問</option>
                  <option value="反問">反問</option>
                  <option value="疊字">疊字</option>
                  <option value="層遞">層遞</option>
                  <option value="雙聲">雙聲</option>
                  <option value="疊韻">疊韻</option>
                  <option value="雙關">雙關</option>
                  <option value="通感">通感</option>
                  <option value="顏色詞">顏色詞</option>
                  <option value="示現">示現</option>
                </select>
              </div>
              題目:
              <input type="text" name="firstname" required />
              主旨:
              <input type="text" name="email" required />
              預覽
              <div className="border rounded-[20px] p-5 min-h-[200px] w-[200px]">
                {prompt}
              </div>
              <button aria-busy={loading ? "true" : "false"} type="submit">
                生成
              </button>
            </form>
          </div>

          <div className="container">
            <section id="Result">
              Result:
              {result.map((result) => {
                return (
                  <article key={result}>
                    <div className="whitespace-pre">{result}</div>
                  </article>
                );
              })}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
