// Firebase SDKの中から、initializeApp という関数を読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

// Firebaseで認証機能を使うために必要な関数を読み込んで使えるように
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, // メアドとパスで新しいユーザーを登録するため
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// 追加SDKを組み込む必要があればimport、最新のバージョンに！
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

//////////////////ウェブアプリの Firebase 構成//////////////////////
////////////////////////////////////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIfOs",
  authDomain: "test01-39e51.firebaseapp.com",
  projectId: "test01-39e51",
  storageBucket: "test01-39e51.firebasestorage.app",
  messagingSenderId: "89",
  appId: "1:d9",
};

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// Initialize Firebase と接続
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authサービスを初期化
const db = getDatabase(app); // RealtimeDatabase使うよ
const dbRef = ref(db, "chat"); // RealtimeDatabase内の”chat“を使う
console.log("dbRef:", dbRef);

////////////////////////////////////////////////////////////////////

// ================== セクションのHTML要素の取得
const registerSection = document.getElementById("register-section");
const signinFormSection = document.getElementById("signin-form-section");
const boardSection = document.getElementById("board-section");
const listSection = document.getElementById("list-section");
const signinLink = document.getElementById("go-signin-link"); // ログインは「こちら」リンク
const registerLink = document.getElementById("go-register-link"); // 無料登録は「こちら」リンク
const genderSelect = document.getElementById("gender");
const ageSelect = document.getElementById("age");

// HTMLセクション要素が「現在表示されてるか」を判定するための関数
function isVisible(section) {
  return !section.classList.contains("hide");
}

// 画面を切り替えるための共通関数
function showSection(sectionToShow) {
  // 引数名を sectionToShow に変更して分かりやすく、全て非表示に
  signinFormSection.classList.add("hide");
  registerSection.classList.add("hide");
  boardSection.classList.add("hide");
  listSection.classList.add("hide");

  // 指定されたセクションから hide を削除して表示
  sectionToShow.classList.remove("hide"); // 引数で受け取ったセクションだけ表示

  // 丸いオレンジボタンの表示/非表示
  const allHabitsBtn = document.querySelector(".all-habits");
  if (allHabitsBtn) {
    if (sectionToShow === listSection) {
      // 一覧画面の場合
      allHabitsBtn.classList.add("hide"); // ボタンを非表示
    } else {
      // それ以外の画面なら
      allHabitsBtn.classList.remove("hide"); // ボタンを表示
    }
  }
}

// ================== 画面切り替え

// 初期表示（ログイン画面）
document.addEventListener("DOMContentLoaded", () => {
  // 初期画面の表示
  showSection(signinFormSection);

  // ログイン画面の無料登録は「こちら」をクリック時
  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      showSection(registerSection); // 登録画面に切り替え
    });
  }

  // 登録画面のログインは「こちら」をクリック時
  if (signinLink) {
    signinLink.addEventListener("click", function (e) {
      e.preventDefault();
      showSection(signinFormSection); // ログイン画面に切り替え
    });
  }

  // ================== ボタン

  // 丸いオレンジボタンで一覧画面に切り替え
  const allHabits = document.querySelector(".all-habits"); // DOM要素を取得
  if (allHabits) {
    allHabits.addEventListener("click", function () {
      // ログインまたは登録画面が表示されている場合
      if (isVisible(registerSection) || isVisible(signinFormSection)) {
        alert("ログインしてください");
      }
      // 投稿画面が表示されている場合
      else if (isVisible(boardSection)) {
        showSection(listSection); // 一覧画面に切り替え
      }
    });
  }

  // ロゴクリック時
  const logo = document.querySelector(".logo"); // DOM要素を取得
  if (logo) {
    logo.addEventListener("click", function () {
      // ログイン画面または登録画面が表示されている場合（isVisible = 表示・非表示を制御）
      if (isVisible(registerSection) || isVisible(signinFormSection)) {
        alert("ログインしてください");
      }
      // 投稿画面または一覧画面が表示されている場合
      else if (isVisible(boardSection) || isVisible(listSection)) {
        // listSectionからの切り替えも考慮
        showSection(boardSection); // 投稿画面に切り替え
      }
    });
  }
});

// ================== 新規会員登録

const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupBtn = document.getElementById("signup-btn");

if (signupBtn) {
  signupBtn.addEventListener("click", function () {
    const email = signupEmail.value;
    const password = signupPassword.value;

    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    } else if (!password) {
      alert("6字以上のパスワードを入力してください");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password) // Firebaseでアカウント作成
      .then((userCredential) => {
        alert("登録が完了しました");
        showSection(boardSection); // 登録成功後、投稿画面に切り替え
      })
      .catch((error) => {
        alert("登録できません");
      });
  });
}

// ================== ログイン

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    const email = loginEmail.value; // 入力されたメアド
    const password = loginPassword.value; // 入力されたパスワード
    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    } else if (!password) {
      alert("6字以上のパスワードを入力してください");
      return;
    }

    signInWithEmailAndPassword(auth, email, password) // Firebaseでログイン
      .then((userCredential) => {
        // ★★★ 修正箇所9: showSection 関数で画面を切り替える ★★★
        showSection(boardSection); // ログイン成功後、投稿画面に切り替え
      })
      .catch((error) => {
        alert("ログインできません");
      });
  });
}

// ================== 投稿する

const sendBtn = document.getElementById("send");
const textArea = document.getElementById("text");
const titleInput = document.getElementById("title");
const outputDiv = document.getElementById("output");

if (sendBtn) {
  sendBtn.addEventListener("click", function (e) {
    e.preventDefault(); // デフォルトのフォーム送信を制御

    const title = titleInput.value;
    const text = textArea.value;
    const gender = genderSelect.value;
    const age = ageSelect.value;

    // タイトルと本文を入力したかチェック = バリデーション
    if (!title) {
      alert("タイトルを入力してください");
      return;
    }
    if (!text) {
      alert("本文を入力してください");
      return;
    }

    // 投稿データを作成
    const postData = {
      title: title,
      text: text,
      gender: gender,
      age: age,
      time: Date.now(),
    };

    // Firebaseに保存、投稿完了アラート
    const newPostRef = push(dbRef); // UNIQUE_ID を自動生成
    set(newPostRef, postData) // データを保存
      .then(() => {
        alert("投稿完了しました");
        titleInput.value = ""; // タイトルをクリア
        textArea.value = ""; // 本文をクリア
        genderSelect.value = ""; // 性別をクリア
        ageSelect.value = ""; // 年代をクリア
        showSection(listSection); // 投稿成功後、一覧画面に切り替え
      })
      .catch((error) => {
        alert("投稿できません: " + error.message);
        console.error("Firebase投稿エラーの詳細:", error);
        console.error("エラーコード:", error.code);
        console.error("エラーメッセージ:", error.message);
      });
  });
}

// ================== 受信イベント（Firebaseからのデータ受信）

onChildAdded(dbRef, function (data) {
  const post = data.val();
  const key = data.key;

  // 性別を日本語に変換
  const genderJp =
    post.gender === "male"
      ? "男性"
      : post.gender === "female"
      ? "女性"
      : post.gender === "other"
      ? "その他"
      : "";

  //年代を日本語に変換
  let ageJp = "";
  switch (post.age) {
    case "teens":
      ageJp = "10代";
      break;
    case "twenties":
      ageJp = "20代";
      break;
    case "thirties":
      ageJp = "30代";
      break;
    case "forties":
      ageJp = "40代";
      break;
    case "fifties":
      ageJp = "50代";
      break;
    case "sixties":
      ageJp = "60代";
      break;
    case "seventies":
      ageJp = "70代";
      break;
    case "eighties-plus":
      ageJp = "80代以上";
      break;
    default:
      ageJp = "";
  }

  const html = `
    <div id="msg-${key}" class="post">
      <h3>${post.title}</h3>
      <p class="main-text">${post.text}</p>
      <div class="col2">
        <span class="date">${new Date(post.time).toLocaleDateString()}</span>
        <p class="profile"> （${genderJp}・${ageJp}）</p>
      </div>
    </div>
  `;
  outputDiv.innerHTML = html + outputDiv.innerHTML;
});
