const $c = document.querySelector("canvas");
const ctx = $c.getContext("2d");
const button = document.querySelector("button");

const product = [
  "네이버페이", // 3%
  "GS25", // 5%
  "이삭토스트", // 6%
  "빽다방", // 5%
  "사탕", // 31%
  "네이버페이", // 3%
  "GS25", // 5%
  "이삭토스트", //6%
  "빽다방", // 5%
  "초콜릿", // 31%
];

const colors = [
  "#dc0936",
  "#e6471d",
  "#f7a416",
  "#efe61f ",
  "#60b236",
  "#209b6c",
  "#169ed8",
  "#3f297e",
  "#87207b",
  "#be107f",
  "#e7167b",
];

const probabilities = [
  0.03, 0.05, 0.06, 0.05, 0.31, 0.03, 0.05, 0.06, 0.05, 0.31,
]; // 각 아이템의 당첨 확률

let winnerIndex = null;

const newMake = () => {
  const [cw, ch] = [$c.width / 2, $c.height / 2]; // 캔버스의 중앙 좌표를 계산합니다.
  const arc = Math.PI / (product.length / 2); // 각 섹션의 각도를 계산합니다. 총 2*PI 라디안에서 섹션 수만큼 나누어 각 섹션의 각도를 구합니다.

  // 섹션을 순차적으로 그립니다.
  for (let i = 0; i < product.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length]; // 섹션의 색상을 설정합니다.
    ctx.moveTo(cw, ch); // 중앙 좌표로 이동합니다.
    ctx.arc(cw, ch, cw, arc * (i - 1), arc * i); // 섹션의 호를 그립니다.
    ctx.fill(); // 섹션을 채웁니다.

    ctx.closePath();
  }

  // 텍스트를 그립니다.
  ctx.fillStyle = "#fff"; // 텍스트 색상을 설정합니다.
  ctx.font = "18px Pretendard"; // 폰트를 설정합니다.
  ctx.textAlign = "center"; // 텍스트 정렬을 설정합니다.

  // 섹션 중앙에 텍스트를 그립니다.
  for (let i = 0; i < product.length; i++) {
    const angle = arc * i + arc / 2; // 각 섹션의 중앙 각도를 계산합니다.

    ctx.save(); // 현재 상태를 저장합니다.

    ctx.translate(
      cw + Math.cos(angle) * (cw - 50),
      ch + Math.sin(angle) * (ch - 50)
    ); // 섹션 중앙으로 이동합니다.

    ctx.rotate(angle + Math.PI / 2); // 텍스트를 섹션의 방향에 맞게 회전시킵니다.

    product[i].split(" ").forEach((text, j) => {
      ctx.fillText(text, 0, 30 * j); // 텍스트를 그립니다.
    });

    ctx.restore(); // 이전 상태로 복원합니다.
  }
};

const selectWinner = () => {
  const cumulativeProbabilities = probabilities.map(
    (
      (sum) => (value) =>
        (sum += value)
    )(0)
  );
  const random = Math.random();

  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (random < cumulativeProbabilities[i]) {
      return i;
    }
  }
  return; //cumulativeProbabilities.length - 1; // 어떤 이유로든 확률이 누락되었을 경우 마지막 항목을 반환
};

const showModal = (message) => {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const closeModal = document.querySelector(".close");

  modalMessage.textContent = message;
  modal.style.display = "block";

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};

const rotate = () => {
  if (button.disabled) return; // 이미 회전 중이면 실행하지 않음
  button.disabled = true; // 버튼 비활성화

  $c.style.transform = "initial";
  $c.style.transition = "initial";
  newMake(); // 초기화 후 다시 그리기

  setTimeout(() => {
    winnerIndex = selectWinner();
    const arc = 360 / product.length;
    const offset = 90; // 룰렛의 윗부분이 0도이므로 90도 오프셋 추가(네이버페이가 시작점임)
    const rotate = 360 * 4 - arc * winnerIndex - arc / 2 - offset; // 4바퀴 돌기 + 당첨 섹션 중앙에 멈추기

    $c.style.transform = `rotate(${rotate}deg)`;
    $c.style.transition = "3s ease-out"; // 감속 효과 추가

    setTimeout(() => {
      showModal(`당첨된 아이템: ${product[winnerIndex]}`);

      button.disabled = false; // 회전이 끝나면 버튼 활성화
      newMake(); // 새로 그리기 및 강조 표시
    }, 3000);
  }, 1);
};

newMake();

button.addEventListener("click", rotate);
