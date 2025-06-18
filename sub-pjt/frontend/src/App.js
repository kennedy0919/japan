import React, { useState, useEffect } from "react";
import './App.css';

// 40개의 이미지 버튼 목록 (업데이트된 일본어 단어 리스트)
const items = [
  { word: "細い", src: "/images/1.jpg" },
  { word: "太い", src: "/images/2.jpg" },
  { word: "陰", src: "/images/3.jpg" },
  { word: "陽", src: "/images/4.jpg" },
  { word: "呑む", src: "/images/5.jpg" },
  { word: "女", src: "/images/6.jpg" },
  { word: "長い", src: "/images/7.jpg" },
  { word: "食", src: "/images/8.jpg" },
  { word: "短い", src: "/images/9.jpg" },
  { word: "男", src: "/images/10.jpg" },
  { word: "若い", src: "/images/11.jpg" },
  { word: "老", src: "/images/12.jpg" },
  { word: "騒がしい", src: "/images/13.jpg" },
  { word: "賢い", src: "/images/14.jpg" },
  { word: "疲れる", src: "/images/15.jpg" },
  { word: "静かな", src: "/images/16.jpg" },
  { word: "多い", src: "/images/17.jpg" },
  { word: "遊ぶ", src: "/images/18.jpg" },
  { word: "少ない", src: "/images/19.jpg" },
  { word: "友", src: "/images/20.jpg" },
  { word: "眠る", src: "/images/21.jpg" },
  { word: "善", src: "/images/22.jpg" },
  { word: "煙", src: "/images/23.jpg" },
  { word: "寂しい", src: "/images/24.jpg" },
  { word: "苦しい", src: "/images/25.jpg" },
  { word: "辛い", src: "/images/26.jpg" },
  { word: "和", src: "/images/27.jpg" },
  { word: "忙しい", src: "/images/28.jpg" },
  { word: "幸せ", src: "/images/29.jpg" },
  { word: "悪い", src: "/images/30.jpg" },
  { word: "魂", src: "/images/31.jpg" },
  { word: "速い", src: "/images/32.jpg" },
  { word: "穏やか", src: "/images/33.jpg" },
  { word: "酒", src: "/images/34.jpg" },
  { word: "愛", src: "/images/35.jpg" },
  { word: "遅い", src: "/images/36.jpg" },
  { word: "喜ぶ", src: "/images/37.jpg" },
  { word: "楽", src: "/images/38.jpg" },
  { word: "哀しい", src: "/images/39.jpg" },
  { word: "怒り", src: "/images/40.jpg" }
];

export default function App() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [generatedStory, setGeneratedStory] = useState("");
  const [showNovelPage, setShowNovelPage] = useState(false);
  const [displayedStory, setDisplayedStory] = useState("");

  const handleClick = (word) => {
    setSelectedWords(prev => [...prev, word]);
  };

  const clearSelection = () => {
    setSelectedWords([]);
    setGeneratedStory("");
    setShowNovelPage(false);
  };

  const handleNovelPageClick = () => {
  setShowNovelPage(false);
  setDisplayedStory("");
  };

  useEffect(() => {
    if (!showNovelPage || !generatedStory) return;

    setDisplayedStory("");
    let idx = 0;
    const timer = setInterval(() => {
      setDisplayedStory(prev => prev + generatedStory.charAt(idx));
      idx++;
      if (idx >= generatedStory.length) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [showNovelPage, generatedStory]);

  const handleConfirm = async () => {
    if (selectedWords.length === 0) return;

    setShowNovelPage(true);
    
    try {
      const res = await fetch("http://192.168.0.37:8080/api/novel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: selectedWords })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const text = await res.text();
      setGeneratedStory(text);
      setShowNovelPage(true);
    } catch (err) {
      console.error(err);
      alert("소설 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      {/* 검은색 상단 라인 only on selection page */}
      {!showNovelPage && <div className="top-line"></div>}
      {/* 헤더 (옵션) */}
      {!showNovelPage && <header className="header"></header>}

      {/* 페이지 전환 */}
      {!showNovelPage ? (
        <main className="content" style={{ marginBottom: "200px" }}>
          <div className="layout">
            <div className="button-grid">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  className="btn image-btn"
                  style={{ width: '200px', height: '200px' }}
                  onClick={() => handleClick(item.word)}
                >
                  <img
                    src={item.src}
                    alt={item.word}
                    className="btn-image"
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {selectedWords.length > 0 && (
            <div className="selected-line" style={{ fontSize: '1.5rem', marginTop: '20px' }}>
              {selectedWords.join(' ')}
              <div>
                <button className="clear-btn" onClick={clearSelection}>削除</button>
                <button className="confirm-btn" onClick={handleConfirm}>確認</button>
              </div>
            </div>
          )}
        </main>
      ) : (
        <main className="content" onClick={handleNovelPageClick} style={{ cursor: 'pointer' }}>
          <div className="novel-wrapper" style={{ postion: 'relative' }}>
            <div className="vertical-text">{displayedStory}</div>
          </div>
          {/* <button className="confirm-btn" onClick={() => setShowNovelPage(false)} style={{ marginTop: '20px' }}>
            戻る
          </button> */}
        </main>
      )}
    </div>
  );
}
