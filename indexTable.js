var json =[     //jsonサンプルデータ
    {"本文" : "「吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。」という書き出しで始まり、中学校の英語教師である珍野苦沙弥の家に飼われている猫である「吾輩」の視点から、珍野一家や、そこに集う彼の友人や門下の書生たち、「太平の逸民」（第二話、第三話）の人間模様が風刺的・戯作的に描かれている。着想は、E.T.A.ホフマンの長編小説『牡猫ムルの人生観』だと考えられている[1][注 1][注 2]。 また『吾輩は猫である』の構成は、『トリストラム・シャンディ』の影響とも考えられている[2][3]。『吾輩は猫である』原稿の一部漱石が所属していた俳句雑誌『ホトトギス』では、小説も盛んになり、高浜虚子や伊藤左千夫らが作品を書いていた。こうした中で虚子に勧められて漱石も小説を書くことになった。それが1905年1月に発表した『吾輩は猫である』で、当初は最初に発表した第1回のみの、読み切り作品であった[4]。しかもこの回は、漱石の許可を得た上で虚子の手が加えられており[4]、他の回とは多少文章の雰囲気が異なる。だがこれが好評になり、虚子の勧めで翌年8月まで、全11回連載し、掲載誌『ホトトギス』は売り上げを大きく伸ばした（元々俳句雑誌であったが、有力な文芸雑誌の一つとなった）[4][注 3]。"
    },
    [{
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
    ]

      // table要素を生成
      var table = document.createElement('table');

      //クラス要素を追加
      table.classList.add("u-full-width");

      // ヘッダーを作成
      var tr = document.createElement('tr');
      for (key in json[1][0]) {
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
      for (var i = 0; i < json[1].length; i++) {
        // tr要素を生成
        var tr = document.createElement('tr');
        // th・td部分のループ
        for (key in json[1][0]) {
              // td要素を生成
              var td = document.createElement('td');
              // td要素内にテキストを追加
              td.textContent = json[1][i][key];
              // td要素をtr要素の子要素に追加
              tr.appendChild(td);
            }
        // tr要素をtable要素の子要素に追加
        table.appendChild(tr);
        }
      // 生成したtable要素を追加する
      document.getElementById('indexTable').appendChild(table);


      //p要素を作成
      var allText = document.createElement('p');
      //文字要素を追加
      allText.textContent = json[0]["本文"];
      document.getElementById("AllText").appendChild(allText);

      var Ext = document.createElement("p");
      Ext.textContent = "目次をクリックすると、ここに本文からの抜き出し部分が表示されます";
      document.getElementById("extraction").appendChild(Ext);