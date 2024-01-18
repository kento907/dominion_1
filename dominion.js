// カードリスト
let cards = [
  {"number":0, "name": "堀", "type": "Reaction", "cost": 2},
  {"number":1, "name": "礼拝堂", "type": "None", "cost": 2},
  {"number":2, "name": "地下貯蔵庫", "type": "None", "cost": 2},
  {"number":3, "name": "村", "type": "None", "cost": 3},
  {"number":4, "name": "木こり", "type": "None", "cost": 3},
  {"number":5, "name": "宰相", "type": "None", "cost": 3},
  {"number":6, "name": "工房", "type": "None", "cost": 3},
  {"number":7, "name": "役人", "type": "Attack", "cost": 4},
  {"number":8, "name": "泥棒", "type": "Attack", "cost": 4},
  {"number":9, "name": "祝宴", "type": "None", "cost": 4},
  {"number":10, "name": "金貸し", "type": "None", "cost": 4},
  {"number":11, "name": "民兵", "type": "Attack", "cost": 4},
  {"number":12, "name": "鍛冶屋", "type": "None", "cost": 4},
  {"number":13, "name": "密偵", "type": "Attack", "cost": 4},
  {"number":14, "name": "玉座の間", "type": "None", "cost": 4},
  {"number":15, "name": "改築", "type": "None", "cost": 4},
  {"number":16, "name": "書庫", "type": "None", "cost":5},
  {"number":17, "name": "魔女", "type": "Attack", "cost": 5},
  {"number":18, "name": "祝祭", "type": "None", "cost": 5},
  {"number":19, "name": "研究所", "type": "None", "cost": 5},
  {"number":20, "name": "市場", "type": "None", "cost": 5},
  {"number":21, "name": "鉱山", "type": "None", "cost": 5},
  {"number":22, "name": "議事堂", "type": "None", "cost": 5},
  {"number":23, "name": "冒険者", "type": "None", "cost": 6},
  {"number":24, "name": "庭園", "type": "Victory", "cost": 4},
];

// 設定
// ----------------------------------------------------------
const MAX_ATTACK = 2 // Attackカードの最大枚数
const decide_AveCost = false // 平均コストを指定
// ----------------------------------------------------------

// 0.1単位かを確認する関数
const isApproximatelyEqual = (value1, value2, tolerance = 1e-6) => {
  return Math.abs(value1 - value2) <= tolerance;
}

// cardsでの最小平均コスト
function calculateMinAverageCost(cards) {
  const sortedCards = cards.slice().sort((a, b) => a.cost - b.cost);
  const selectedCards = sortedCards.slice(0, 10);
  const minAverageCost = selectedCards.reduce((sum, card) => sum + card.cost, 0) / selectedCards.length;
  return minAverageCost;
}
// cardsでの最大平均コスト
function calculateMaxAverageCost(cards) {
  const sortedCards = cards.slice().sort((a, b) => b.cost - a.cost);
  const selectedCards = sortedCards.slice(0, 10);
  const maxAverageCost = selectedCards.reduce((sum, card) => sum + card.cost, 0) / selectedCards.length;
  return maxAverageCost;
}
const minAverageCost = calculateMinAverageCost(cards);
const maxAverageCost = calculateMaxAverageCost(cards);

const sortedCards = cards.slice().sort((a, b) => a.cost - b.cost);
console.log(sortedCards)
console.log(minAverageCost);


// ボタンがクリックされたとき
document.getElementById("generateButton").addEventListener("click", function () {
  let selectedCards = [];
  let moatFlag = 0;
  let countAttack = 0;
  let countReset = 0;

  const cardList = document.getElementById("cardList");
  const averageCostElement = document.getElementById("averageCost");
  const resetCountElement = document.getElementById("resetCount");
  const averageCostInput = document.getElementById("averageCostInput");
  const cardImages = document.getElementById("cardImages");
  const averageCostValue = parseFloat(averageCostInput.value); // 平均コスト

  // 範囲外の指定に対してアラート
  if (
    averageCostValue < minAverageCost ||
    averageCostValue > maxAverageCost ||
    !isApproximatelyEqual(averageCostValue, Math.round(averageCostValue * 10) / 10)
    ) {
    window.alert("平均コストは0.1単位で、3.4から4.9の範囲で指定してください．");
    return; // ポップアップが表示されたら生成を中止
  }


  while (true) {

    while (selectedCards.length < 10) {
      const index = Math.floor(Math.random() * cards.length); // cards.lengthは可変
      const card = cards[index];

      if (selectedCards.includes(card)) {
          continue; // すでに選択済みのカードは選ばない
      }

      // カード追加
      selectedCards.push(card);

      // Attackカード選択：堀追加
      if (card.type === "Attack" && moatFlag === 0) {
          cards.push({ number: 1, name: "堀", type: "Reaction", cost: 2 });
          countAttack++;

          // Attack枚数が上限：cardsからAttackカード削除
          if (countAttack === MAX_ATTACK) {
              cards = cards.filter(c => c.type !== "Attack"); 
          }
      }

      // 堀選択：堀削除
      if (card.name === "堀") {
          moatFlag = 1;
          cards = cards.filter(c => c.name !== "堀");
      }
    }

    // 選択したカードの平均コストを計算
    let averageCost = selectedCards.reduce((sum, card) => sum + card.cost, 0) / selectedCards.length;

    // 平均コストが指定値ならループを抜ける
    if (averageCost === averageCostValue) {
      break;
    } else {
      // 初期化
      selectedCards = [];
      moatFlag = 0;
      countAttack = 0;
    }

  }

  // コスト順に並べ替え
  selectedCards.sort((a, b) => a.cost - b.cost);

  // カード名を箇条書きで表示
  cardList.innerHTML = "";
  for (const card of selectedCards) {
    const li = document.createElement("li");
    li.textContent = `${card.cost}: ${card.name}`;

    cardList.appendChild(li);
  }

  // 画像表示
  cardImages.innerHTML = ""; // 一旦中身をクリア
  for (const card of selectedCards) {
    // 画像を表示
    const img = document.createElement("img");
    img.src = `./images/dominion_${card.number}.JPG`;
    img.alt = card.name; // 画像の代替テキスト（カード名）

    // 画像をカードImages要素に追加
    cardImages.appendChild(img);
  }

  
  const averageCost = selectedCards.reduce((sum, card) => sum + card.cost, 0) / selectedCards.length;
  averageCostElement.textContent = `平均コスト: ${averageCost}`;
  // resetCountElement.textContent = `リセット回数: ${countReset}`;
});


// 一度削除したカード（堀，Attack等）はもう一度ボタンを押した時は現れない．→ ボタンを押すたびにリセットしたい
// add