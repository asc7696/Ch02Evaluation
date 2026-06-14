import { Question } from './types';

export const QUESTIONS_BANK: Question[] = [
  // 循序結構
  {
    id: 1,
    type: 'sequence',
    typeLabel: '循序結構',
    code: `price = 80
sum = price * 0.95
sum = sum * 0.5
print("惜食價:", sum)`,
    questionText: '執行這段程式碼計算便利商店優惠後，印出的惜食價格是多少？',
    correctAnswer: '38.0',
    wrongAnswers: ['76.0', '40.0', '80.0', '39.5', '38']
  },
  {
    id: 2,
    type: 'sequence',
    typeLabel: '循序結構',
    code: `height = 150 # 公分
weight = 45  # 公斤
height_m = height / 100
bmi = weight / (height_m ** 2)
print(bmi)`,
    questionText: '根據 BMI 課堂練習，若身高 150 公分、體重 45 公斤，計算出的 BMI 粗估值為多少？',
    correctAnswer: '20.0',
    wrongAnswers: ['19.47', '30.0', '15.0', '22.5', '18.9']
  },
  {
    id: 3,
    type: 'sequence',
    typeLabel: '循序結構',
    code: `age = "16"
year = 2027 - int(age)
print(year)`,
    questionText: '打造聊天機器人中，若 age 輸入字串 "16"，對其進行型態轉換並計算後的 year 結果為？',
    correctAnswer: '2011',
    wrongAnswers: ['2027', '2012', '"2011"', '16', '2026']
  },
  {
    id: 4,
    type: 'sequence',
    typeLabel: '循序結構',
    code: `a = 15
b = 10
a = a + b
b = a - b
print(a, b)`,
    questionText: '觀察循序執行的邏輯：先執行 a = a + b，再執行 b = a - b，最後印出的 a 與 b 各是多少？',
    correctAnswer: '25 15',
    wrongAnswers: ['25 10', '15 10', '10 15', '25 25', '15 25']
  },

  // 選擇結構
  {
    id: 5,
    type: 'selection',
    typeLabel: '選擇結構',
    code: `total = 210
if total >= 180:
    print("已達免運")`,
    questionText: '若外送金額 total 設為 210，執行此段單向選擇結構程式後，最終控制台印出？',
    correctAnswer: '已達免運',
    wrongAnswers: ['無任何輸出', 'total >= 180', 'False', '210', 'total']
  },
  {
    id: 6,
    type: 'selection',
    typeLabel: '選擇結構',
    code: `stu = True
if stu:
    print("可以")
else:
    print("不可以")`,
    questionText: '購買電影學生票活動中，若檢核 stu = True，程式經雙向選擇結構判定會印出？',
    correctAnswer: '可以',
    wrongAnswers: ['不可以', 'True', 'False', 'stu', 'stu = True']
  },
  {
    id: 7,
    type: 'selection',
    typeLabel: '選擇結構',
    code: `price = 750
if price >= 750:
    print("黃金席")
elif price >= 450:
    print("咖啡席")
elif price >= 350:
    print("內野區")
else:
    print("外野區")`,
    questionText: '若職棒座位購票預算為 750 元，經多向 if...elif...else 判斷，會建議購買什麼區域？',
    correctAnswer: '黃金席',
    wrongAnswers: ['咖啡席', '內野區', '外野區', '無推薦', '鑽石席']
  },
  {
    id: 8,
    type: 'selection',
    typeLabel: '選擇結構',
    code: `score = 80
if score >= 90:
    print("優等")
elif score >= 80:
    print("甲等")
elif score >= 70:
    print("乙等")
else:
    print("丙等")`,
    questionText: '根據隨堂等第判定規則，小明考試考了 80 分，其在多向選擇結構中被分配的等第是？',
    correctAnswer: '甲等',
    wrongAnswers: ['優等', '乙等', '丙等', '丁等', '未及格']
  },

  // 重複結構
  {
    id: 9,
    type: 'repetition',
    typeLabel: '重複結構',
    code: `range(1, 15)`,
    questionText: '在 Python loop 中，呼叫 range(1, 15) 函數所產生的整數數列範圍為何？',
    correctAnswer: '1 到 14',
    wrongAnswers: ['1 到 15', '0 到 15', '0 到 14', '1 到 14 每次跳 2', '0 到 15 每次跳 2']
  },
  {
    id: 10,
    type: 'repetition',
    typeLabel: '重複結構',
    code: `sum = 0
for i in range(1, 6):
    sum = sum + i
print(sum)`,
    questionText: '在計算 1 累加到 n 範例中，若設定範圍 range(1, 6)，迴圈執行完成時 sum 的值是多少？',
    correctAnswer: '15',
    wrongAnswers: ['10', '21', '6', '5', '0']
  },
  {
    id: 11,
    type: 'repetition',
    typeLabel: '重複結構',
    code: `for i in range(2, 5):
    for j in range(1, 4):
        x = i ** j`,
    questionText: '關於教材中的巢狀 for 迴圈，外層迴圈 (i) 範圍為 2~4，內層 (j) 範圍為 1~3，總共執行幾次？',
    correctAnswer: '9次',
    wrongAnswers: ['12次', '20次', '6次', '8次', '10次']
  },
  {
    id: 13,
    type: 'repetition',
    typeLabel: '重複結構',
    code: `for i in range(10):
    if i == 4:
        break
    print(i, end="")`,
    questionText: '當 for 迴圈含有 if i == 4: break 關鍵字判定時，控制台印出的最終數字序列結果為？',
    correctAnswer: '0123',
    wrongAnswers: ['01234', '012356789', '0123456789', '1234', '4']
  },
  {
    id: 14,
    type: 'repetition',
    typeLabel: '重複結構',
    code: `for i in range(10):
    if i == 4:
        continue
    print(i, end="")`,
    questionText: '當 for 迴圈含有 if i == 4: continue 控字關鍵詞判定時，控制台印出的最終數列結果為？',
    correctAnswer: '012356789',
    wrongAnswers: ['01234', '0123', '0123456789', '123456789', '4']
  }
];
