export interface VocabEntry {
  word: string;
  reading: string;
  meaning: {
    ja: string;
    fr: string;
  };
  example: {
    ja: string;
    fr: string;
  };
  level: number;
}

export const vocabData: VocabEntry[] = [
  // レベル1（基礎的な単語）
  { 
    word: "学校", 
    reading: "がっこう", 
    meaning: {
      ja: "教育を行うための施設。児童・生徒が学ぶ場所。",
      fr: "École, établissement d'enseignement où l'on dispense une éducation."
    },
    example: {
      ja: "毎朝8時に学校に行きます。",
      fr: "Je vais à l'école tous les matins à 8 heures."
    },
    level: 1 
  },
  { 
    word: "時間", 
    reading: "じかん", 
    meaning: {
      ja: "時刻から時刻までの長さ。物事にかかる期間。",
      fr: "Temps, durée entre deux moments."
    },
    example: {
      ja: "宿題をするのに2時間かかりました。",
      fr: "J'ai mis deux heures pour faire mes devoirs."
    },
    level: 1 
  },
  { 
    word: "友達", 
    reading: "ともだち", 
    meaning: {
      ja: "親しく付き合う同年代の仲間。",
      fr: "Ami, camarade avec qui on entretient des relations amicales."
    },
    example: {
      ja: "休日に友達と公園で遊びました。",
      fr: "J'ai joué au parc avec mes amis pendant les vacances."
    },
    level: 1 
  },
  { word: "電車", reading: "でんしゃ", meaning: { ja: "電気で動く鉄道車両。", fr: "Train électrique, véhicule ferroviaire propulsé par électricité." }, example: { ja: "毎朝、電車で通勤しています。", fr: "Je me rends au travail tous les matins en train électrique." }, level: 1 },
  { word: "天気", reading: "てんき", meaning: { ja: "その日の空模様。晴れ・雨・曇りなどの大気の状態。", fr: "Météo, état de la météo à un moment donné." }, example: { ja: "明日は天気が良くなるそうです。", fr: "Demain, il devrait faire beau." }, level: 1 },

  // レベル2（一般的な単語）
  { word: "図書館", reading: "としょかん", meaning: { ja: "本を収集・保管し、人々に提供する施設。", fr: "Bibliothèque, établissement où l'on récolte et stocke des livres pour les rendre disponibles aux personnes." }, example: { ja: "週末は図書館で勉強することにしています。", fr: "Je vais lire des livres dans la bibliothèque le week-end." }, level: 2 },
  { word: "新聞", reading: "しんぶん", meaning: { ja: "日々のニュースや情報を伝える定期刊行物。", fr: "Journal, publication hebdomadaire qui transmet des informations quotidiennes." }, example: { ja: "毎朝、新聞を読んで情報を集めています。", fr: "Je lis le journal tous les matins pour me tenir au courant des informations." }, level: 2 },
  { word: "食事", reading: "しょくじ", meaning: { ja: "食べ物を食べること。また、食べる物。", fr: "Repas, alimentation." }, example: { ja: "家族で食事をする時間は大切にしています。", fr: "Je respecte le temps des repas avec ma famille." }, level: 2 },
  { word: "公園", reading: "こうえん", meaning: { ja: "市民の憩いや運動のために作られた公共の場所。", fr: "Parc, espace public conçu pour le repos et le sport." }, example: { ja: "休日は公園でジョギングをします。", fr: "Je fais de la course à pied dans le parc le week-end." }, level: 2 },
  { word: "病院", reading: "びょういん", meaning: { ja: "病気やけがの治療を行う医療施設。", fr: "Hôpital, établissement médical où l'on traite les maladies et les blessures." }, example: { ja: "風邪をひいたので病院に行きました。", fr: "J'ai allé voir le médecin car j'avais la grippe." }, level: 2 },

  // レベル3（やや難しい単語）
  { word: "自動車", reading: "じどうしゃ", meaning: { ja: "エンジンの力で走る車。車。", fr: "Voiture, véhicule à moteur." }, example: { ja: "週末は自動車で旅行に行きます。", fr: "Je vais faire une petite excursion en voiture le week-end." }, level: 3 },
  { word: "携帯", reading: "けいたい", meaning: { ja: "持ち歩くこと。また、携帯電話の略。", fr: "Téléphone portable, appareil téléphonique." }, example: { ja: "外出時は必ず携帯を持っていきます。", fr: "Je porte toujours mon téléphone portable avec moi." }, level: 3 },
  { word: "会議", reading: "かいぎ", meaning: { ja: "複数の人が集まって話し合うこと。", fr: "Réunion, rencontre entre plusieurs personnes pour discuter." }, example: { ja: "午後から重要な会議があります。", fr: "Il y a une réunion importante après-midi." }, level: 3 },
  { word: "研究", reading: "けんきゅう", meaning: { ja: "物事を深く調べ考えること。", fr: "Recherche, étude approfondie d'un sujet." }, example: { ja: "大学で環境問題の研究をしています。", fr: "Je fais des recherches sur le sujet de l'environnement à l'université." }, level: 3 },
  { word: "練習", reading: "れんしゅう", meaning: { ja: "繰り返し学んで身につけること。", fr: "Entraînement, pratique répétée d'une activité." }, example: { ja: "毎日ピアノの練習をしています。", fr: "Je pratique le piano tous les jours." }, level: 3 },

  // レベル4（ビジネス・学術的な単語）
  { word: "経済", reading: "けいざい", meaning: { ja: "お金や物資の生産・消費・流通に関する活動。", fr: "Économie, activités liées à la production, à la consommation et au commerce de biens et de services." }, example: { ja: "最近の経済ニュースに注目しています。", fr: "Je suis attentif aux dernières actualités économiques." }, level: 4 },
  { word: "政治", reading: "せいじ", meaning: { ja: "国や社会の秩序を維持し、運営すること。", fr: "Politique, gestion d'un État ou d'une société." }, example: { ja: "政治の動向が経済に影響を与えています。", fr: "Les événements politiques ont un impact sur l'économie." }, level: 4 },
  { word: "環境", reading: "かんきょう", meaning: { ja: "周りを取り巻いている状況や条件。", fr: "Environnement, état de la nature et de l'homme." }, example: { ja: "地球環境を守ることは重要です。", fr: "La protection de l'environnement est importante." }, level: 4 },
  { word: "技術", reading: "ぎじゅつ", meaning: { ja: "物事を作ったり扱ったりする方法や能力。", fr: "Technologie, méthodes et compétences pour créer ou manipuler des choses." }, example: { ja: "新しい技術の開発に取り組んでいます。", fr: "Je travaille sur le développement de nouvelles technologies." }, level: 4 },
  { word: "文化", reading: "ぶんか", meaning: { ja: "人間の生活様式や芸術・学問などの総称。", fr: "Culture, ensemble des modes de vie, des arts et des sciences." }, example: { ja: "日本の伝統文化を学んでいます。", fr: "Je m'informe de la culture traditionnelle du Japon." }, level: 4 },

  // レベル5（より専門的な単語）
  { word: "哲学", reading: "てつがく", meaning: { ja: "人生や世界の本質について深く考える学問。", fr: "Philosophie, étude approfondie des questions de vie et d'univers." }, example: { ja: "大学で哲学の講義を受けています。", fr: "Je suis en cours de philosophie à l'université." }, level: 5 },
  { word: "科学", reading: "かがく", meaning: { ja: "自然界の法則を明らかにする体系的な学問。", fr: "Sciences, études systématiques des lois de la nature." }, example: { ja: "科学の発展は私たちの生活を変えました。", fr: "Le développement des sciences a changé notre vie." }, level: 5 },
  { word: "芸術", reading: "げいじゅつ", meaning: { ja: "美を表現・創造する人間の活動や作品。", fr: "Art, activités et œuvres créées par l'homme pour exprimer ou créer la beauté." }, example: { ja: "週末は美術館で芸術作品を鑑賞します。", fr: "Je vais voir des œuvres d'art au musée le week-end." }, level: 5 },
  { word: "歴史", reading: "れきし", meaning: { ja: "過去の出来事や、その記録。", fr: "Histoire, étude des événements passés et de leur enregistrement." }, example: { ja: "歴史から多くのことを学ぶことができます。", fr: "On peut apprendre beaucoup de choses de l'histoire." }, level: 5 },
  { word: "社会", reading: "しゃかい", meaning: { ja: "人々が集まって共同生活を営む集団や組織。", fr: "Société, groupe d'individus qui vivent et coopèrent ensemble." }, example: { ja: "私たちは社会の一員として責任を持って行動します。", fr: "Nous agissons en tant que membres de la société." }, level: 5 }
]; 