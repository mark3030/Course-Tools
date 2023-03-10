export const mainTemplate = ({ character, pinyin, strokes, medians, spell, whole }) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${character}(${pinyin}) - 笔顺动画</title>
  <script src="scripts/animate.min.js"></script>
</head>
<body>
  <div id="viewer"></div>
  <script>
    const data = {
      type: "chinese",
      width: "3.98rem",
      minWidth: "120",
      maxWidth: "398",
      volume: 50, // 音量调节，数值为 0 - 100
      pages: [
        {
          "character": "${character}",
          "strokes": ${JSON.stringify(strokes)},
          "medians": ${JSON.stringify(medians)},
          "pinyin": ["${pinyin}"],
          "spell": "data/spell.mp3",
          "whole": "data/whole.mp3"
        }
      ]
    };
    
    let stroke = new animate(data);
    stroke.renderTo("viewer").display();
  </script>

</body>
</html>`;