﻿// Элементы

Элемент_Страницы = Элементы.Добавить("Страницы", Тип("ГруппаФормы"));
Элемент_Страницы.Вид = ВидГруппыФормы.Страницы;
Элемент_Страницы.РастягиватьПоГоризонтали = Истина;
Элемент_Страницы.РастягиватьПоВертикали = Ложь;

Элемент_Страница1 = Элементы.Добавить("Страница1", Тип("ГруппаФормы"), Элемент_Страницы);
Элемент_Страница1.Вид = ВидГруппыФормы.Страница;
Элемент_Страница1.Заголовок = "Страница 1";

Элемент_Группа = Элементы.Добавить("Группа", Тип("ГруппаФормы"), Элемент_Страница1);
Элемент_Группа.Вид = ВидГруппыФормы.ОбычнаяГруппа;
Элемент_Группа.Отображение = ОтображениеОбычнойГруппы.Нет;
Элемент_Группа.ОтображатьЗаголовок = Ложь;
Элемент_Группа.Группировка = ГруппировкаПодчиненныхЭлементовФормы.ГоризонтальнаяВсегда;
Элемент_Группа.РастягиватьПоГоризонтали = Истина;
Элемент_Группа.РастягиватьПоВертикали = Ложь;

Элемент_Группа1 = Элементы.Добавить("Группа1", Тип("ГруппаФормы"), Элемент_Группа);
Элемент_Группа1.Вид = ВидГруппыФормы.ОбычнаяГруппа;
Элемент_Группа1.Заголовок = "Группа 1";
Элемент_Группа1.Отображение = ОтображениеОбычнойГруппы.Нет;
Элемент_Группа1.Группировка = ГруппировкаПодчиненныхЭлементовФормы.Вертикальная;
Элемент_Группа1.РастягиватьПоГоризонтали = Истина;
Элемент_Группа1.РастягиватьПоВертикали = Ложь;

Элемент_Реквизит1 = Элементы.Добавить("Реквизит1", Тип("ДекорацияФормы"), Элемент_Группа1);
Элемент_Реквизит1.Вид = ВидДекорацииФормы.Надпись;
Элемент_Реквизит1.Заголовок = "Реквизит 1";