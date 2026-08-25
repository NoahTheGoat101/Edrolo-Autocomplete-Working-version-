let aiAnswer;
const AI = async (model) => {
  const questionElements = document.getElementsByClassName('styles__question___WhczD')

  const questionArray = Array.from(questionElements).map(el => el.innerText.trim());

  const questionText = questionArray.join("\n\n");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": "DELETE THIS TEXT AND REPLACE IT WITH YOUR API KEY!!!",
    },
    body: JSON.stringify({
      system_instruction: {

        parts: [
          {
            text: `You are an AI that must complete a series of questions. 
Your response should strictly follow one of these formats depending on the question type:

## Multiple choice:
{
  "type": "mc",
  "answer": "A" // or B, C, D — only one character
}

## Short answer:
{
  "type": "sa",
  "answer": "..." // concise, relevant answer only
}

## Response Guidelines:
- Be concise and factual.
- Never include em dashes (—) or trailing periods at the end of answers.
- Do not add commentary, reasoning, or explanations outside the JSON structure.
- If something that the question is asking is missing, just say "i dont know" for short answer and make an educated guess for multiple choice

### Expected Lengths:
- Physics / Math: keep answers to brief equations or numeric expressions.
- Biology / Writing / phyics or math questions that arent equations: keep answers to 1–2 short, clear sentences.
- Never exceed 2 lines for any short answer.
`
          }
        ]
      },
      contents: [
        {
          parts: [
            {
              text: `Determine if this multiple choice question is A, B, C, or D.
Question. If you have come to the conclusion that it is a short answer question, write the answer: ${questionText}`
            }
          ]
        }
      ],
      "generationConfig": {
        "responseMimeType": "application/json",
        "responseSchema": {
          "type": "object",
          "properties": {
            "output_type": {
              "type": "string",
              "enum": ["mc", "sa"]
            },
            "answer": {
              "type": "string"
            }
          },
          "required": ["output_type", "answer"]
        }
      }

    }),
  });
  const test = await response.json()
  console.log(test)
  const thing = test.candidates[0].content.parts[0].text
  aiAnswer = JSON.parse(thing)
  console.log(aiAnswer.answer)

}

let flag = true
const getDataTest = (data_test) => {
  return document.querySelector(`[data-test="${data_test}"]`)
}
setInterval(() => {
  const textarea1 = getDataTest("checklist-question-answer-text-input")
  const questionSection = getDataTest("question-s")
  const maxMarks = document.getElementsByClassName("styles__totalMarks___s5VVp")[0];
  const multiChoiceSubmitButton = getDataTest("submit-s")
  //const nextQuestion = getDataTest("question-response-nav-button")
  let nextQuestion = getDataTest("question-response-nav-button")
  let checkForUnderstanding = getDataTest("grokked")
  let checkMark = getDataTest("checklist-tick")
  const textAreaValue = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  let input = getDataTest("self-mark-input")
  const markSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  if (questionSection &&
    questionSection.getElementsByTagName("li").length > 0) {
    console.log("multiple choice")
    setInterval(async () => {
      if (!questionSection)
        return;



      if (flag === true) {
        const multiChoiceQuestions = document.querySelector('[data-test="question-s"]').getElementsByTagName("li");
        flag = false
        console.log('AI ran for multi choice')
        await AI("gemini-3.1-flash-lite") // REPLACE WITH A DIFFERENT MODEL IF YOU WANT TO

        if (aiAnswer.answer === "A") {
          multiChoiceQuestions[0].click()
          flag = true
        } else if (aiAnswer.answer === "B") {
          multiChoiceQuestions[1].click()
          flag = true
        } else if (aiAnswer.answer === "C") {
          multiChoiceQuestions[2].click()
          flag = true
        } else if (aiAnswer.answer === "D") {
          multiChoiceQuestions[3].click()
          flag = true
        } else {
          console.log('Output something that wasnt multi choice')
        }


      }

      multiChoiceSubmitButton.click()
      setTimeout(() => {
        let checkForUnderstanding = getDataTest("grokked")

        checkForUnderstanding.click()
        if (checkForUnderstanding) {
          checkForUnderstanding.click()
        }

        setTimeout(
          () => {
            let nextQuestion = getDataTest("question-response-nav-button")

            nextQuestion.click()
            if (nextQuestion) {
              nextQuestion.click()
            }

          },
          500);
      }, 500);
    }, 1100);
  }
  else if (textarea1 || checkMark) {

    console.log('text')
    setTimeout(async () => {

      if (!textAreaValue)
        return;




      if (flag === true) {
        console.log(flag)
        flag = false
        console.log('still runs lol')
        await AI("gemini-3.1-flash-lite")  // REPLACE WITH A DIFFERENT MODEL IF YOU WANT TO

        textAreaValue.call(textarea1, `${aiAnswer.answer}`);
        textarea1.dispatchEvent(new Event('input', { bubbles: true }));
        textarea1.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('ran')

        console.log(flag)
      }


      setTimeout(async () => {
        const submitBtn = getDataTest("submit-l")
        if (!submitBtn) {
          setTimeout(() => {

            let text = maxMarks.textContent;
            text.split("")
            console.log(text[3])

            markSetter.call(input, parseInt(text[3]));

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            setTimeout(() => {
              let checkForUnderstanding = getDataTest("grokked")
              checkForUnderstanding.click()

              setTimeout(() => {
                let checkMark = getDataTest("checklist-tick")
                for (let i = 0; i < 7; i++) {

                  checkMark.click()
                }
              }, 50);
              setTimeout(
                () => {
                  let nextQuestion = getDataTest("question-response-nav-button")
                  nextQuestion.click()
                  if (nextQuestion) {
                    nextQuestion.click()
                  }

                  setTimeout(() => {
                    flag = true
                  }, 3000)
                },
                50);
            }, 50);
          }, 50);
        } else {
          console.log('Click submit when ready')
/*Will automatically submit the AI's answer for short answer. Uncomment at your own risk*/
          //document.querySelector('[data-test="submit-l"]').click()
        }
      }, 50);
    }, 2000);
  }
  else {
    console.log("solutions")
    if (document.querySelector('[data-test="question-response-nav-button"]')) {
      document.querySelector('[data-test="question-response-nav-button"]').click()
    let nextQuestion = getDataTest("question-response-nav-button")
    if (nextQuestion) {
      nextQuestion.click()
    }
}

    setInterval(() => {
      let w = document.querySelector('[data-test="submit-w"]')
      let a = document.querySelector('[data-test="submit-a"]')

      if (!w) {
        if (!a) {
          setTimeout(() => {


            let text = maxMarks.textContent;
            text.split("")
            console.log(text[3])

            markSetter.call(input, parseInt(text[3]));

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            setTimeout(() => {
              let checkForUnderstanding = getDataTest("grokked")
              checkForUnderstanding.click()
              if (checkForUnderstanding) {
                checkForUnderstanding.click()
              }

              setTimeout(
                () => {
                  let checkForUnderstanding = getDataTest("grokked")
                  checkForUnderstanding.click()
                  if (checkForUnderstanding) {
                    checkForUnderstanding.click()
                  }
                },
                100);
            }, 100);
          }, 100);

        } else {
          document.querySelector('[data-test="submit-a"]').click()
          let a = document.querySelector('[data-test="submit-a"]')
          if (a) {
            a.click()
          }
          setTimeout(() => {
            let input = document.querySelector('[data-test="self-mark-input"]');
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;


            let max = document.getElementsByClassName("styles__totalMarks___s5VVp")[0];
            let text = max.textContent;

            console.log(text[3])
            document.querySelector('[data-test="question-response-nav-button"]').click()
            nativeInputValueSetter.call(input, parseInt(text[3]));

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            setTimeout(() => {
              document.querySelector('[data-test="grokked"]').click()
              let checkForUnderstanding = getDataTest("grokked")
              if (checkForUnderstanding) {
                checkForUnderstanding.click()
              }

              setTimeout(() => {
                for (let i = 0; i < 7; i++) {
                  document.querySelector('[data-test="checklist-tick"]').click()
                }
                document.querySelector('[data-test="question-response-nav-button"]').click()
                let nextQuestion = getDataTest("question-response-nav-button")
                if (nextQuestion) {
                  nextQuestion.click()
                }

              }, 50);
              setTimeout(() => {
                document.querySelector('[data-test="question-response-nav-button"]').click()
                let nextQuestion = getDataTest("question-response-nav-button")
                if (nextQuestion) {
                  nextQuestion.click()
                }
              }, 50);
            }, 50);
          }, 50);
        }
      }
      else {
        console.log('clicked?')

        document.querySelector('[data-test="submit-w"]').click()
        let w = document.querySelector('[data-test="submit-w"]')
        if (w) {
          w.click()
        }

      }
    }, 1600);
  }
}, 5000);