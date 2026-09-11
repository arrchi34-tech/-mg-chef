'use client';

import { useMemo, useState } from 'react';

type Question = { id: number; text: string; options: string[]; correct: number; note: string };
type Category = { id: string; title: string; subtitle: string; icon: string; color: string; questions?: Question[]; passScore?: number };
type Attempt = { id: number; employeeName: string; categoryId: string; categoryTitle: string; score: number; total: number; passed: boolean; completedAt: string };

const fryerQuestions: Question[] = [
  { id: 1, text: 'Какая рабочая температура фритюра установлена для новых стандартов?', options: ['175°C ± 5°C', '180°C ± 5°C', '185°C', '190°C ± 5°C'], correct: 1, note: 'Для всех новых стандартов фритюра рабочая температура — 180°C ± 5°C.' },
  { id: 2, text: 'До какого уровня можно заполнять корзину фритюра?', options: ['Полностью', 'Не более чем на 3/4', 'Не более чем наполовину', 'Ограничений нет'], correct: 2, note: 'Корзину заполняют не более чем наполовину: так масло не переливается и продукт готовится равномерно.' },
  { id: 3, text: 'Когда нужно встряхнуть корзину, если для продукта нет особого правила?', options: ['Через 30 секунд', 'Через 1 минуту', 'В конце приготовления', 'Не нужно встряхивать'], correct: 0, note: 'Общее правило — встряхнуть корзину через 30 секунд, если в стандарте продукта не указано иначе.' },
  { id: 4, text: 'Сколько времени продукт должен стечь после жарки?', options: ['5–7 секунд', '10–15 секунд', '20–30 секунд', 'Сразу переложить в упаковку'], correct: 1, note: 'После жарки дайте маслу стечь 10–15 секунд перед перекладыванием.' },
  { id: 5, text: 'Как часто нужно оценивать состояние масла?', options: ['В конце каждой смены', 'Раз в неделю', 'После процеживания, не реже одного раза в 2 дня', 'Только когда масло потемнело'], correct: 2, note: 'Состояние масла оценивают после процеживания, но не реже одного раза в 2 дня.' },
  { id: 6, text: 'Как правильно посолить картофель фри, батат или картофель по-деревенски?', options: ['Посолить до жарки', 'После стекания масла переложить в гастроёмкость 1/6 и посолить', 'Посолить прямо в корзине', 'Соль не использовать'], correct: 1, note: 'Соль добавляют после стекания масла: продукт перекладывают в гастроёмкость 1/6.' },
  { id: 7, text: 'Какое правило действует для хашбраунов?', options: ['Не более 4 штук, строго в один слой', 'Не более 6 штук, можно в два слоя', 'Не более 2 штук, в один слой', 'Количество и слой не важны'], correct: 0, note: 'Хашбрауны готовят не более 4 штук и строго в один слой.' },
  { id: 8, text: 'Что нужно сделать, если из палочек с сыром начал вытекать сыр?', options: ['Дожарить до конца', 'Сразу достать', 'Увеличить температуру', 'Встряхнуть корзину'], correct: 1, note: 'Если сыр начал вытекать, палочки нужно сразу достать, чтобы не потерять начинку.' },
  { id: 9, text: 'Сколько готовится картофель фри во фритюре?', options: ['2:30', '3:00', '3:30', '4:00'], correct: 1, note: 'Картофель фри готовится 3:00.' },
  { id: 10, text: 'Какая фасовка картофеля фри S / M / L?', options: ['75 / 150 / 225 г', '77 / 154 / 230 г', '90 / 150 / 225 г', '70 / 140 / 210 г'], correct: 0, note: 'Фасовка картофеля фри: S — 75 г, M — 150 г, L — 225 г.' },
  { id: 11, text: 'Какой стандарт у картофеля по-деревенски?', options: ['3:00; S / M / L: 75 / 150 / 225 г', '3:30; S / M / L: 77 / 154 / 230 г', '3:30; S / M: 90 / 150 г', '2:30; S / M / L: 77 / 154 / 230 г'], correct: 1, note: 'Картофель по-деревенски: 3:30; S / M / L — 77 / 154 / 230 г.' },
  { id: 12, text: 'Какая фасовка батата фри S / M?', options: ['75 / 150 г', '77 / 154 г', '90 / 150 г', '90 / 180 г'], correct: 2, note: 'Батат фри: S — 90 г, M — 150 г.' },
  { id: 13, text: 'Какой стандарт у хашбраунов?', options: ['3:00; 2 штуки', '3:30; 2 штуки', '3:30; 4 штуки', '2:30; 2 штуки'], correct: 1, note: 'Хашбрауны готовятся 3:30; одна порция — 2 штуки.' },
  { id: 14, text: 'Какой стандарт у палочек с сыром?', options: ['2:30; S / M / L: 3 / 5 / 8 штук', '3:00; S / M / L: 3 / 5 / 8 штук', '2:30; S / M / L: 4 / 6 / 9 штук', '3:30; S / M / L: 3 / 5 / 8 штук'], correct: 0, note: 'Палочки с сыром: 2:30; S / M / L — 3 / 5 / 8 штук.' },
  { id: 15, text: 'Как готовят драники?', options: ['СВЧ 0:30, кнопка 3, в контейнере с крышкой; вручную в корзину; фритюр 1:30', 'СВЧ 1:00, кнопка 5; фритюр 3:30', 'Сразу фритюр 3:30', 'СВЧ 0:30, кнопка 3; затем гриль 1:30'], correct: 0, note: 'Драники: СВЧ 0:30, кнопка 3, в контейнере с крышкой; затем вручную в корзину и фритюр 1:30.' },
  { id: 16, text: 'Какой стандарт у жареных шампиньонов ПФ?', options: ['1:00; 30 г', '1:30; 30 г', '1:00; 50 г', '3:00; 30 г'], correct: 0, note: 'Жареные шампиньоны ПФ: 1:00; порция 30 г.' },
  { id: 17, text: 'Какой стандарт у чуррос?', options: ['3:00; 5 штук; после жарки дать маслу стечь 10–15 секунд', '2:30; 5 штук; сразу упаковать', '3:30; 4 штуки; встряхнуть через 30 секунд', '3:00; 8 штук; посолить'], correct: 0, note: 'Чуррос: 3:00; 5 штук. После жарки маслу нужно стечь 10–15 секунд.' },
  { id: 18, text: 'Какой стандарт у сырной котлеты?', options: ['2:30; 1 штука', '3:00; 1 штука; после жарки дать маслу стечь 10–15 секунд', '3:00; 2 штуки', '3:30; 1 штука'], correct: 1, note: 'Сырная котлета: 3:00; 1 штука; после жарки — стекание масла 10–15 секунд.' },
  { id: 19, text: 'Какой стандарт у куриных наггетсов?', options: ['3:00; S / M / L: 4 / 6 / 9 штук', '3:30; S / M / L: 3 / 6 / 9 штук', '3:00; S / M / L: 3 / 5 / 8 штук', '2:30; S / M / L: 4 / 6 / 9 штук'], correct: 0, note: 'Куриные наггетсы: 3:00; S / M / L — 4 / 6 / 9 штук.' },
  { id: 20, text: 'Какой стандарт у куриных стрипсов?', options: ['3:00; S / M / L: 3 / 6 / 9 штук', '3:30; S / M / L: 3 / 6 / 9 штук', '3:30; S / M / L: 3 / 5 / 8 штук', '3:00; S / M / L: 4 / 6 / 9 штук'], correct: 1, note: 'Куриные стрипсы: 3:30; S / M / L — 3 / 6 / 9 штук.' },
  { id: 21, text: 'Какая фасовка крыльев S / M / L?', options: ['3 / 6 / 9 штук', '4 / 7 / 10 штук', '3 / 5 / 8 штук', '4 / 6 / 9 штук'], correct: 2, note: 'Крылья: S / M / L — 3 / 5 / 8 штук.' },
  { id: 22, text: 'Как правильно приготовить куриные крылья?', options: ['СВЧ 1:00, кнопка 5; вручную переложить в корзину; фритюр 3:30', 'СВЧ 0:30, кнопка 3; фритюр 1:30', 'Сразу фритюр 3:30', 'СВЧ 1:00, кнопка 5; фритюр 3:00'], correct: 0, note: 'Крылья: СВЧ 1:00, кнопка 5; вручную переложить в корзину; затем фритюр 3:30.' },
  { id: 23, text: 'Какой стандарт у митболлов?', options: ['3:00; S / M / L: 4 / 7 / 10 штук', '3:30; S / M / L: 4 / 7 / 10 штук', '3:30; S / M / L: 3 / 5 / 8 штук', '3:00; S / M / L: 3 / 6 / 9 штук'], correct: 1, note: 'Митболлы: 3:30; S / M / L — 4 / 7 / 10 штук.' },
  { id: 24, text: 'Какой стандарт у рыбных палочек?', options: ['3:00; S / M / L: 3 / 5 / 8 штук; строго в один слой', '3:30; S / M / L: 3 / 5 / 8 штук; встряхнуть через 30 секунд', '3:00; S / M / L: 4 / 6 / 9 штук', '2:30; S / M / L: 3 / 5 / 8 штук'], correct: 0, note: 'Рыбные палочки: 3:00; S / M / L — 3 / 5 / 8 штук; готовить строго в один слой.' },
  { id: 25, text: 'Какой стандарт у темпурных креветок?', options: ['3:00; S / M / L: 3 / 5 / 8 штук', '3:30; S / M / L: 3 / 5 / 8 штук', '3:30; S / M / L: 4 / 7 / 10 штук', '3:00; S / M / L: 3 / 6 / 9 штук'], correct: 1, note: 'Темпурные креветки: 3:30; S / M / L — 3 / 5 / 8 штук.' },
  { id: 26, text: 'Какой стандарт у жареных пельменей?', options: ['3:00; 175 г; перед жаркой разделить слипшиеся пельмени', '3:00; 240 г; жарить без подготовки', '3:30; 175 г; встряхнуть через 30 секунд', '2:30; 175 г; готовить в два слоя'], correct: 0, note: 'Жареные пельмени: 3:00; 175 г. Перед жаркой обязательно разделите слипшиеся пельмени.' },
];

const burgerQuestions: Question[] = [
  { id: 1, text: 'Как правильно разогреть говяжью котлету для актуальных стандартов бургеров?', options: ['В СВЧ 1:30, кнопка 6, в пластиковой гастроёмкости 1/6 с крышкой', 'В СВЧ 1:00, кнопка 5, без крышки', 'Во фритюре 3:00', 'В прижимном гриле 1:30'], correct: 0, note: 'Говяжью котлету разогревают в пластиковой гастроёмкости 1/6 с крышкой: СВЧ 1:30, кнопка 6.' },
  { id: 2, text: 'Как подготовить булочку перед разогревом?', options: ['Развернуть срезами наружу и положить половинки одну на другую', 'Положить половинки срезами внутрь', 'Разогреть булочку целиком', 'Сначала смазать соусом'], correct: 0, note: 'Булочку разворачивают срезами наружу и складывают половинки одна на другую.' },
  { id: 3, text: 'Сколько прогревается булочка в прижимном гриле?', options: ['0:30', '1:00', '1:30', '3:00'], correct: 1, note: 'Булочка прогревается в прижимном гриле 1:00.' },
  { id: 4, text: 'В каком направлении собирают любой бургер по актуальным схемам?', options: ['Сверху вниз', 'Снизу вверх', 'Порядок не важен', 'Сначала все соусы, затем остальные слои'], correct: 1, note: 'Бургер всегда собирают строго снизу вверх, по схеме конкретного продукта.' },
  { id: 5, text: 'Какое общее время приготовления бургера «С говяжьей и сырной котлетой»?', options: ['5:00', '6:00', '6:30', '7:00'], correct: 2, note: 'Бургер «С говяжьей и сырной котлетой» готовится 6:30.' },
  { id: 6, text: 'Какой первый слой после нижней булочки в бургере «С говяжьей и сырной котлетой»?', options: ['Брусничный соус 14 г', 'Сырный соус 20 г витками', 'Салат айсберг 15 г', 'Котлета из говядины'], correct: 1, note: 'После нижней булочки наносят сырный соус — 20 г витками.' },
  { id: 7, text: 'Сколько брусничного соуса наносят между говяжьей и сырной котлетой?', options: ['10 г', '14 г', '20 г', '30 г'], correct: 1, note: 'После говяжьей котлеты наносят 14 г брусничного соуса витками.' },
  { id: 8, text: 'Какая масса томатов в бургере «С говяжьей и сырной котлетой»?', options: ['18 г', '20 г', '30 г', '40 г'], correct: 2, note: 'В этом бургере томаты — 30 г.' },
  { id: 9, text: 'Сколько огурцов маринованных в бургере «Гриль с сыром»?', options: ['6 г', '15 г', '20 г', '30 г'], correct: 2, note: 'В «Гриль с сыром» добавляют 20 г маринованных огурцов.' },
  { id: 10, text: 'Какая масса томатов в бургере «Гриль с сыром»?', options: ['15 г', '18 г', '30 г', '40 г'], correct: 1, note: 'Томаты в бургере «Гриль с сыром» — 18 г.' },
  { id: 11, text: 'Какой соус и в каком количестве наносится первым в авторском бургере с брусничным соусом?', options: ['Чесночный соус 10 г', 'Грибной соус 10 г', 'Брусничный соус 14 г', 'Соус гриль 14 г'], correct: 1, note: 'Первый слой после нижней булочки — грибной соус, 10 г витками.' },
  { id: 12, text: 'Сколько маринованных огурцов в авторском бургере с брусничным соусом?', options: ['6 г', '10 г', '15 г', '20 г'], correct: 0, note: 'В авторском бургере маринованные огурцы — 6 г.' },
  { id: 13, text: 'Какое общее время приготовления бургера «С сырной котлетой»?', options: ['3:30', '4:00', '5:00', '6:30'], correct: 2, note: 'Бургер «С сырной котлетой» готовится 5:00.' },
  { id: 14, text: 'Какая масса томатов в бургере «С сырной котлетой»?', options: ['18 г', '30 г', '40 г', '50 г'], correct: 2, note: 'Томаты в бургере «С сырной котлетой» — 40 г.' },
  { id: 15, text: 'Какой соус наносят в бургере «С сырной котлетой» и сколько?', options: ['Брусничный соус по 20 г витками снизу и сверху', 'Сырный соус 20 г только снизу', 'Чесночный соус по 10 г', 'Соус гриль по 14 г'], correct: 0, note: 'В бургере «С сырной котлетой» брусничный соус наносят по 20 г витками снизу и сверху.' },
  { id: 16, text: 'Сколько наггетсов кладут в чикенбургер?', options: ['2 штуки', '3 штуки', '4 штуки', '5 штук'], correct: 2, note: 'В чикенбургере используется 4 куриных наггетса.' },
  { id: 17, text: 'Какой соус и сколько используют в чикенбургере?', options: ['Соус чили сладкий 14 г', 'Чесночный соус по 8 г витками снизу и сверху', 'Соус тартар по 15 г', 'Грибной соус 10 г'], correct: 1, note: 'В чикенбургере чесночный соус наносят по 8 г витками снизу и сверху.' },
  { id: 18, text: 'Как готовят бургер «С хрустящей курицей»?', options: ['Сливочный сыр 16 г, 2 стрипса, соус чили сладкий 14 г', 'Чесночный соус 8 г, 4 наггетса', 'Тартар 15 г, 2 рыбные палочки', 'Брусничный соус 20 г, сырная котлета'], correct: 0, note: 'В бургере «С хрустящей курицей»: сливочный сыр 16 г, 2 стрипса, соус чили сладкий 14 г.' },
  { id: 19, text: 'Какой стандарт у фишбургера?', options: ['2 рыбные палочки, салат айсберг 20 г, тартар по 15 г витками снизу и сверху', '4 наггетса и чесночный соус по 8 г', '2 стрипса и соус чили 14 г', 'Сырная котлета и брусничный соус по 20 г'], correct: 0, note: 'Фишбургер: 2 рыбные палочки, салат айсберг 20 г, тартар по 15 г витками снизу и сверху.' },
  { id: 20, text: 'Какое время приготовления бургера «Кимчи с говяжьей котлетой»?', options: ['3:00', '3:30', '4:00', '5:00'], correct: 1, note: 'Бургер «Кимчи с говяжьей котлетой» готовится 3:30.' },
  { id: 21, text: 'Сколько капусты кимчи кладут в каждый из двух слоёв бургера «Кимчи с говяжьей котлетой»?', options: ['10 г', '15 г', '20 г', '30 г'], correct: 2, note: 'Капусту кимчи кладут в два слоя, по 20 г в каждом.' },
  { id: 22, text: 'Какая масса сыра чеддер в сезонных бургерах с кимчи?', options: ['1 слайс, 12 г', '2 слайса, 24 г', '2 слайса, 40 г', '3 слайса, 24 г'], correct: 1, note: 'В обоих бургерах с кимчи — 2 слайса чеддера, всего 24 г.' },
  { id: 23, text: 'Какой стандарт у бургера «Кимчи со стрипсами»?', options: ['Общее время 4:00; 2 стрипса, фритюр 3:00', 'Общее время 3:30; 4 наггетса', 'Общее время 5:00; сырная котлета', 'Общее время 4:00; 2 рыбные палочки'], correct: 0, note: '«Кимчи со стрипсами»: 4:00; 2 стрипса готовятся во фритюре 3:00.' },
  { id: 24, text: 'Как готовится хэшбраун для бургера «С грибами а-ля рус»?', options: ['СВЧ 1:30, кнопка 6', 'Фритюр 3:00', 'Прижимной гриль 1:00', 'Фритюр 1:30'], correct: 1, note: 'Хэшбраун для бургера «С грибами а-ля рус» готовится во фритюре 3:00.' },
  { id: 25, text: 'Сколько жареных шампиньонов добавляют в бургер «С грибами а-ля рус»?', options: ['15 г', '20 г', '23 г', '30 г'], correct: 2, note: 'В бургер «С грибами а-ля рус» добавляют 23 г жареных шампиньонов.' },
  { id: 26, text: 'Какой слой идёт непосредственно перед верхней булочкой в бургере «С грибами а-ля рус»?', options: ['Жареный лук 5 г', 'Маринованные огурцы 30 г', 'Чесночный соус 10 г витками', 'Сыр чеддер 12 г'], correct: 2, note: 'Последний слой перед верхней булочкой — чесночный соус, 10 г витками.' },
];

const categories: Category[] = [
  { id: 'fryer', title: 'Фритюр', subtitle: '26 вопросов · температура, время, порции и порядок', icon: '♨', color: 'orange', questions: fryerQuestions, passScore: 21 },
  { id: 'burgers', title: 'Бургеры', subtitle: '26 вопросов · сборка, веса ингредиентов и отдача', icon: '▤', color: 'red', questions: burgerQuestions, passScore: 21 },
  { id: 'pizza', title: 'Пицца', subtitle: 'Слои, веса и работа с печью', icon: '◒', color: 'yellow' },
  { id: 'shawarma', title: 'Шаурма', subtitle: 'Сборка, граммовки и упаковка', icon: '≋', color: 'green' },
  { id: 'coffee', title: 'Кофе', subtitle: 'Напитки с сиропами и без', icon: '◉', color: 'coffee' },
  { id: 'lemonades', title: 'Лимонады', subtitle: 'Основа, лёд, вода и подача', icon: '✦', color: 'blue' },
  { id: 'asian', title: 'Азиатская линейка', subtitle: 'Сезонное меню: фритюр, бургеры, напитки', icon: '◈', color: 'purple' },
  { id: 'russian', title: 'Русская кухня', subtitle: 'Сезонное меню: бургер, драники, лимонад', icon: '✳', color: 'rose' },
];

const passScore = 21;

export default function Home() {
  const [screen, setScreen] = useState<'welcome' | 'categories' | 'quiz' | 'result' | 'dashboard'>('welcome');
  const [employee, setEmployee] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [journalLoading, setJournalLoading] = useState(false);
  const today = useMemo(() => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()), []);
  const questions = activeCategory?.questions ?? [];
  const score = answers.reduce((sum, answer, index) => sum + Number(answer === questions[index]?.correct), 0);
  const currentPassScore = activeCategory?.passScore ?? passScore;
  const passed = score >= currentPassScore;
  const begin = () => { if (employee.trim()) setScreen('categories'); };
  const openCategory = (category: Category) => { if (!category.questions) return; setActiveCategory(category); setQuestionIndex(0); setAnswers([]); setSelected(null); setScreen('quiz'); };
  const recordAttempt = async (finalAnswers: number[]) => {
    if (!activeCategory) return;
    const finalScore = finalAnswers.reduce((sum, answer, index) => sum + Number(answer === questions[index]?.correct), 0);
    setSaveState('saving');
    try {
      const response = await fetch('/api/attempts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ employeeName: employee, categoryId: activeCategory.id, categoryTitle: activeCategory.title, score: finalScore, total: questions.length }) });
      if (!response.ok) throw new Error('save failed');
      const data = await response.json() as { attempt: Attempt };
      setAttempts((current) => [data.attempt, ...current]);
      setSaveState('saved');
    } catch { setSaveState('error'); }
  };
  const loadJournal = async () => {
    setJournalLoading(true);
    try {
      const response = await fetch('/api/attempts');
      if (!response.ok) throw new Error('load failed');
      const data = await response.json() as { attempts: Attempt[] };
      setAttempts(data.attempts);
    } finally { setJournalLoading(false); setScreen('dashboard'); }
  };
  const nextQuestion = () => { if (selected === null) return; const nextAnswers = [...answers, selected]; if (questionIndex + 1 === questions.length) { setAnswers(nextAnswers); setScreen('result'); void recordAttempt(nextAnswers); return; } setAnswers(nextAnswers); setQuestionIndex((index) => index + 1); setSelected(null); };
  const retry = () => { setQuestionIndex(0); setAnswers([]); setSelected(null); setScreen('quiz'); };
  const passRate = attempts.length ? Math.round((attempts.filter((attempt) => attempt.passed).length / attempts.length) * 100) : 0;
  const averageScore = attempts.length ? Math.round((attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) / attempts.length)) : 0;

  return <main className="trainer-shell">
    <header className="topbar">
      <button className="brand" onClick={() => screen !== 'welcome' && setScreen('categories')} aria-label="К выбору категории"><span className="brand-mark">S</span><span><b>STANDART</b><small>Тренажёр знаний</small></span></button>
      <div className="topbar-meta"><button className="journal-button" onClick={() => void loadJournal()} disabled={journalLoading}>{journalLoading ? 'Открываем…' : 'Журнал'}</button>{employee && <span className="employee-chip">{employee}</span>}<span className="date-chip">{today}</span></div>
    </header>

    {screen === 'welcome' && <section className="welcome-view">
      <div className="welcome-copy"><p className="eyebrow">ПРОВЕРКА ЗНАНИЙ · НОВЫЕ СТАНДАРТЫ</p><h1>Знай стандарт.<br /><em>Готовь уверенно.</em></h1><p className="lead">Выберите направление, ответьте на вопросы и сразу разберите ошибки — до следующей смены, а не после неё.</p><div className="feature-row"><span>✓ Результат сразу</span><span>✓ Разбор ошибок</span><span>✓ Статистика попыток</span></div></div>
      <form className="identity-card" onSubmit={(event) => { event.preventDefault(); begin(); }}><span className="step-label">01 / НАЧАТЬ</span><h2>Кто проходит тест?</h2><p>Укажите имя — оно попадёт в журнал результатов.</p><label htmlFor="employee">ФИО сотрудника</label><input id="employee" value={employee} onChange={(event) => setEmployee(event.target.value)} placeholder="Например, Анна Соколова" autoComplete="name" /><div className="autodate"><span>Дата прохождения</span><b>{today}</b></div><button className="primary-button" type="submit" disabled={!employee.trim()}>Выбрать категорию <span>→</span></button><small className="privacy-note">Результат будет сохранён в журнале обучения.</small></form>
    </section>}

    {screen === 'categories' && <section className="category-view"><div className="section-heading"><div><p className="eyebrow">02 / НАПРАВЛЕНИЕ</p><h1>Что повторяем сегодня?</h1></div><p>Доступны тесты, основанные на утверждённых новых стандартах.</p></div><div className="category-grid">{categories.map((category) => <article className={`category-card ${category.color} ${category.questions ? 'ready' : 'soon'}`} key={category.id}><div className="category-icon" aria-hidden="true">{category.icon}</div><div className="category-info"><span>{category.questions ? 'ГОТОВО' : 'СКОРО'}</span><h2>{category.title}</h2><p>{category.subtitle}</p></div><button onClick={() => openCategory(category)} disabled={!category.questions}>{category.questions ? 'Начать тест' : 'В подготовке'} <b>→</b></button></article>)}</div><p className="category-footnote">Фритюр и бургеры: по 26 вопросов, проходной результат 21/26.</p></section>}

    {screen === 'dashboard' && <section className="dashboard-view"><div className="dashboard-top"><div><button className="back-button" onClick={() => setScreen('categories')}>← К категориям</button><p className="eyebrow">ЖУРНАЛ РУКОВОДИТЕЛЯ</p><h1>Результаты обучения</h1></div><button className="secondary-button" onClick={() => void loadJournal()}>{journalLoading ? 'Обновляем…' : 'Обновить'}</button></div><div className="stat-grid"><article><span>Всего попыток</span><b>{attempts.length}</b></article><article><span>Прошли с зачётом</span><b>{passRate}%</b></article><article><span>Средний результат</span><b>{averageScore}%</b></article></div><div className="attempt-table"><div className="attempt-table-head"><span>Сотрудник</span><span>Категория</span><span>Дата</span><span>Результат</span><span>Статус</span></div>{attempts.length === 0 ? <p className="empty-attempts">Пока нет попыток. Здесь появятся результаты после первого прохождения теста.</p> : attempts.map((attempt) => <div className="attempt-row" key={attempt.id}><b>{attempt.employeeName}</b><span>{attempt.categoryTitle}</span><span>{new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(attempt.completedAt))}</span><strong>{attempt.score} / {attempt.total}</strong><i className={attempt.passed ? 'status-pass' : 'status-repeat'}>{attempt.passed ? 'Зачёт' : 'Повторить'}</i></div>)}</div></section>}

    {screen === 'quiz' && activeCategory && questions[questionIndex] && <section className="quiz-view"><div className="quiz-topline"><button className="back-button" onClick={() => setScreen('categories')}>← К категориям</button><span>{activeCategory.title} · вопрос {questionIndex + 1} из {questions.length}</span></div><div className="progress-track" aria-label={`Выполнено ${questionIndex + 1} из ${questions.length}`}><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div><article className="question-card"><span className="question-number">{String(questionIndex + 1).padStart(2, '0')}</span><p className="question-kicker">ВЫБЕРИТЕ ОДИН ВАРИАНТ</p><h1>{questions[questionIndex].text}</h1><div className="answer-list">{questions[questionIndex].options.map((option, index) => <button key={option} className={`answer-option ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={selected === index}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p><i aria-hidden="true" /></button>)}</div><div className="question-actions"><span>{selected === null ? 'Выберите вариант ответа' : 'Ответ выбран'}</span><button className="primary-button" onClick={nextQuestion} disabled={selected === null}>{questionIndex + 1 === questions.length ? 'Завершить тест' : 'Следующий вопрос'} <b>→</b></button></div></article></section>}

    {screen === 'result' && activeCategory && <section className="result-view"><div className={`result-hero ${passed ? 'passed' : 'not-passed'}`}><div className="score-orbit" style={{ '--score': `${(score / questions.length) * 100}%` } as React.CSSProperties}><div><b>{score}</b><span>из {questions.length}</span></div></div><div><p className="eyebrow">{activeCategory.title.toUpperCase()} · РЕЗУЛЬТАТ</p><h1>{passed ? 'Зачёт. Отличная работа!' : 'Есть что повторить.'}</h1><p>{passed ? `Вы набрали ${score} баллов при проходном результате ${currentPassScore}.` : `Для зачёта нужно ${currentPassScore} балл. Сейчас — ${score}. Разберите ошибки и попробуйте снова.`}</p><div className="result-actions"><button className="primary-button" onClick={retry}>Пройти ещё раз <b>↻</b></button><button className="secondary-button" onClick={() => setScreen('categories')}>Другая категория</button></div><small className={`save-state ${saveState}`}>{saveState === 'saving' && 'Сохраняем результат…'}{saveState === 'saved' && '✓ Результат сохранён в журнале'}{saveState === 'error' && 'Результат не сохранился — повторите попытку позже.'}</small></div></div><div className="review-heading"><div><p className="eyebrow">РАЗБОР ОТВЕТОВ</p><h2>{score === questions.length ? 'Все ответы верные' : `Ошибок: ${questions.length - score}`}</h2></div><span>{score === questions.length ? 'Можно переходить к следующей категории.' : 'Откройте карточки ниже — там верный ответ и пояснение.'}</span></div>{score !== questions.length && <div className="mistake-list">{questions.map((question, index) => answers[index] !== question.correct && <details key={question.id} className="mistake-card" open><summary><span>Вопрос {question.id}</span><p>{question.text}</p><b>⌄</b></summary><div className="mistake-body"><p className="your-answer"><small>Ваш ответ</small>{question.options[answers[index]]}</p><p className="right-answer"><small>Верный ответ</small>{question.options[question.correct]}</p><p className="standard-note">{question.note}</p></div></details>)}</div>}</section>}
  </main>;
}
