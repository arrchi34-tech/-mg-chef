export type ExpiryEvent = 'defrost' | 'opened';

export type ExpiryItem = {
  id: string;
  name: string;
  group: string;
  defrostHours?: number;
  openedHours?: number;
  defrostRule?: string;
  openedRule?: string;
  condition: string;
};

// Витрина содержит только позиции с подтверждёнными данными поставщика.
// Предварительные HACCP-значения намеренно не включены в расчёт.
export const expiryItems: ExpiryItem[] = [
  { id: 'chicken-spicy', name: 'Колбаски куриные «Чикен спайси»', group: 'Птица', defrostHours: 72, openedHours: 72, defrostRule: '72 часа', openedRule: '72 часа', condition: '0…+6 °C, относительная влажность не выше 75%' },
  { id: 'ham-sliced', name: 'Ветчина свиная, слайсовая', group: 'Мясо', defrostHours: 120, openedHours: 48, defrostRule: 'Не более 5 суток', openedRule: 'Не более 48 часов', condition: '+2…+6 °C' },
  { id: 'bacon', name: 'Бекон свиной варёно-копчёный', group: 'Мясо', defrostHours: 168, openedHours: 72, defrostRule: 'Не более 7 суток', openedRule: 'Не более 3 суток', condition: 'По условиям поставщика' },
  { id: 'pickles-whole', name: 'Огурцы маринованные, не резанные', group: 'Бакалея', openedHours: 72, openedRule: 'Не более 3 суток', condition: '+2…+6 °C после вскрытия банки' },
  { id: 'mustard', name: 'Соус горчичный', group: 'Соусы', openedHours: 72, openedRule: 'Не более 72 часов', condition: '0…+20 °C, в пределах общего срока годности' },
  { id: 'chicken-popcorn', name: 'Куриный попкорн в панировке', group: 'Птица', defrostHours: 48, openedHours: 48, defrostRule: 'Не более 48 часов', openedRule: 'Не более 48 часов', condition: 'По условиям поставщика' },
  { id: 'ketchup', name: 'Кетчуп томатный РБК', group: 'Соусы', openedHours: 720, openedRule: 'Не более 30 суток', condition: '0…+10 °C после вскрытия' },
  { id: 'beef-sausages', name: 'Колбаски говяжьи', group: 'Мясо', openedHours: 72, openedRule: '3 суток', condition: '0…+6 °C, относительная влажность не выше 75%' },
  { id: 'mushrooms-pickled', name: 'Шампиньоны резанные маринованные', group: 'Бакалея', openedHours: 72, openedRule: '3 суток', condition: 'По условиям поставщика' },
  { id: 'grill-sauce', name: 'Соус гриль', group: 'Соусы', openedHours: 72, openedRule: '72 часа', condition: '0…+20 °C, в пределах общего срока годности' },
  { id: 'trout', name: 'Форель слабосолёная', group: 'Рыба и морепродукты', openedHours: 24, openedRule: 'Не более 24 часов', condition: '0…+2 °C; диапазон дефростации 4–8 часов сверяйте со стандартом поставщика' },
  { id: 'fries', name: 'Картофель фри', group: 'Овощи', openedHours: 48, openedRule: '2 суток', condition: 'Готовить из замороженного состояния; не дефростировать' },
  { id: 'jalapeno', name: 'Халапеньо маринованный', group: 'Бакалея', openedHours: 48, openedRule: 'Не более 48 часов', condition: 'По условиям поставщика' },
  { id: 'truffle-sauce', name: 'Трюфельный соус', group: 'Соусы', openedHours: 72, openedRule: 'Не более 72 часов', condition: '0…+20 °C, в пределах общего срока годности' },
  { id: 'pizza-tomato-sauce', name: 'Соус томатный для пиццы', group: 'Соусы', openedHours: 72, openedRule: 'Не более 72 часов', condition: 'По условиям поставщика' },
  { id: 'sriracha', name: 'Соус шрирача', group: 'Соусы', openedHours: 72, openedRule: '72 часа', condition: 'По условиям поставщика' },
  { id: 'lingonberry-sauce', name: 'Соус брусничный', group: 'Соусы', openedHours: 168, openedRule: 'Не более 7 суток', condition: 'До +25 °C, в пределах общего срока годности' },
  { id: 'shawarma-sauce', name: 'Соус для шаурмы', group: 'Соусы', openedHours: 72, openedRule: '72 часа', condition: 'По условиям поставщика' },
  { id: 'garlic-sauce', name: 'Соус чесночный РБК', group: 'Соусы', openedHours: 72, openedRule: '72 часа', condition: '0…+20 °C, в пределах общего срока годности' },
  { id: 'cheese-sauce', name: 'Соус сырный РБК', group: 'Соусы', openedHours: 72, openedRule: 'Не более 72 часов', condition: 'По условиям поставщика' },
  { id: 'barbecue', name: 'Соус барбекю РБК', group: 'Соусы', openedHours: 72, openedRule: 'Не более 72 часов', condition: '0…+25 °C, в пределах общего срока годности' },
  { id: 'pickles-cut', name: 'Огурцы маринованные резанные', group: 'Бакалея', openedHours: 240, openedRule: '10 суток', condition: '0…+6 °C' },
  { id: 'bubbles', name: 'Виноградные джусболы', group: 'Напитки', openedHours: 168, openedRule: '7 суток', condition: '+4…+10 °C' },
  { id: 'fried-onion', name: 'Лук фри', group: 'Бакалея', openedHours: 168, openedRule: '7 суток', condition: 'По условиям поставщика' },
  { id: 'mac-cheese', name: 'Макароны «Мак-энд-чиз»', group: 'Тесто и мука', defrostHours: 12, defrostRule: '12 часов', condition: '+2…+4 °C, влажность не выше 75%; после вскрытия упаковки хранению не подлежит' },
  { id: 'milk', name: 'Молоко 3,2%', group: 'Молочные продукты', openedHours: 72, openedRule: '72 часа', condition: '+2…+6 °C' },
  { id: 'mortadella', name: 'Колбаса «Мортаделла»', group: 'Мясо', openedHours: 72, openedRule: 'Не более 3 суток', condition: 'По условиям поставщика' },
  { id: 'mozzarella', name: 'Сыр моцарелла тёртый', group: 'Сыры', defrostHours: 336, openedHours: 72, defrostRule: '14 суток', openedRule: '3 суток', condition: '+2…+6 °C, влажность не более 85%, в пределах общего срока годности' },
  { id: 'kimchi-sauce', name: 'Соус кимчи', group: 'Соусы', openedHours: 240, openedRule: 'Не более 10 суток', condition: '+2…+6 °C' },
];

export const expiryQuestions = [
  { id: 1, text: 'Какой срок после вскрытия у ветчины свиной, слайсовой?', options: ['24 часа', '48 часов', '72 часа', '5 суток'], correct: 1, note: 'После вскрытия ветчину слайсовую хранят не более 48 часов при +2…+6 °C.' },
  { id: 2, text: 'Какой срок после вскрытия у молока 3,2%?', options: ['24 часа', '48 часов', '72 часа', '7 суток'], correct: 2, note: 'После вскрытия молоко 3,2% хранят 72 часа при +2…+6 °C.' },
  { id: 3, text: 'Сколько хранится после вскрытия соус для шаурмы?', options: ['24 часа', '48 часов', '72 часа', '7 суток'], correct: 2, note: 'Соус для шаурмы после вскрытия хранится 72 часа.' },
  { id: 4, text: 'Как нужно обращаться с картофелем фри перед приготовлением?', options: ['Готовить сразу из замороженного состояния, не дефростировать', 'Дефростировать 48 часов при +2…+6 °C', 'Дефростировать до комнатной температуры', 'Размораживать перед каждой порцией'], correct: 0, note: 'Картофель фри готовят из замороженного состояния. Дефростировать его не нужно.' },
  { id: 5, text: 'В маркировке ветчины указана ошибка. Что нужно исправить?', options: ['Срок после вскрытия: указать 48 часов', 'Температуру: повысить до +20 °C', 'Срок после вскрытия: указать 7 суток', 'Не указывать дату и время вскрытия'], correct: 0, note: 'После вскрытия ветчину слайсовую хранят не более 48 часов при +2…+6 °C.', visualCheck: { label: 'ПРОВЕРКА МАРКИРОВКИ', title: 'Ветчина слайсовая · после вскрытия', fields: [{ label: 'Вскрыли', value: '15.09 · 10:00' }, { label: 'Списать', value: '22.09 · 10:00' }, { label: 'Хранение', value: '+2…+6 °C' }], helper: 'Проверьте срок на этикетке.' } },
  { id: 6, text: 'Какой срок после вскрытия у огурцов маринованных резанных?', options: ['72 часа', '5 суток', '10 суток', '30 суток'], correct: 2, note: 'Огурцы маринованные резанные после вскрытия хранят 10 суток при +2…+6 °C.' },
  { id: 7, text: 'Можно ли хранить «Мак-энд-чиз» после вскрытия упаковки?', options: ['Да, 12 часов', 'Да, 24 часа', 'Нет, хранению не подлежит', 'Да, 3 суток'], correct: 2, note: 'После вскрытия упаковки «Мак-энд-чиз» хранению не подлежит.' },
  { id: 8, text: 'Какой срок после вскрытия у соуса кимчи?', options: ['72 часа', '7 суток', '10 суток', '30 суток'], correct: 2, note: 'Соус кимчи после вскрытия хранят не более 10 суток при +2…+6 °C.' },
  { id: 9, text: 'Какой срок после вскрытия у брусничного соуса?', options: ['72 часа', '5 суток', '7 суток', '10 суток'], correct: 2, note: 'Брусничный соус после вскрытия хранят не более 7 суток при температуре до +25 °C в пределах общего срока годности.' },
  { id: 10, text: 'Какой срок после дефростации у тёртой моцареллы?', options: ['3 суток', '7 суток', '14 суток', '30 суток'], correct: 2, note: 'После дефростации тёртую моцареллу хранят 14 суток при +2…+6 °C, но не дольше общего срока годности.' },
];
