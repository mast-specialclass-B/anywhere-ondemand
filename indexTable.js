var json =[     //jsonサンプルデータ
      {
        "目次番号":1 ,"目次":"王貞治"
      }
      ,
      {
        "目次番号":2 ,"目次":"野村克也"
      }
      ,
      {
        "目次番号":3 ,"目次":"門田博光"
      }
      ,
      {
        "目次番号":4 ,"目次":"山本浩二"
      }
      ,
      {
        "目次番号":5 ,"目次":"清原和博"
      }
    ]

      // table要素を生成
      var table = document.createElement('table');

      //クラス要素を追加
      table.classList.add("u-full-width");

      // ヘッダーを作成
      var tr = document.createElement('tr');
      for (key in json[0]) {
            // th要素を生成
            var th = document.createElement('th');
            // th要素内にテキストを追加
            th.textContent = key;
            // th要素をtr要素の子要素に追加
            tr.appendChild(th);
            }
        // tr要素をtable要素の子要素に追加
        table.appendChild(tr);

      // テーブル本体を作成
      for (var i = 0; i < json.length; i++) {
        // tr要素を生成
        var tr = document.createElement('tr');
        // th・td部分のループ
        for (key in json[0]) {
              // td要素を生成
              var td = document.createElement('td');
              // td要素内にテキストを追加
              td.textContent = json[i][key];
              // td要素をtr要素の子要素に追加
              tr.appendChild(td);
            }
        // tr要素をtable要素の子要素に追加
        table.appendChild(tr);
        }
      // 生成したtable要素を追加する
      document.getElementById('indexTable').appendChild(table);