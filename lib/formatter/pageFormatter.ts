import { PageElement } from "../elements/pageElement"
import * as t from "../parser/lexer"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"
import { PropertiesFormatter } from "./propertiesFormatter"

export class PageFormatter implements IFormatter<PageElement> {
  public format(element: PageElement): string[] {
    const indent = "  "
    const result: string[] = []

    const header = this.getHeader(element)
    result.push(header)

    for (const item of element.items) {
      const text = FormFormatterFactory.getFormatter(item).format(item)
      result.push(...text.map((line) => indent + line))
    }

    return result
  }

  private getHeader(element: PageElement): string {
    const excludeProperties = ["Заголовок"]

    const propertiesFormatter = new PropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    let result = t.Slash.LABEL as string

    result += element.properties["Заголовок"] ?? ""

    result += properties

    return result
  }
}

// &НаКлиенте
// Процедура ФорматироватьСтраницы(ПараметрыВыполнения, ЭлементДанных, Выполнена)
// 	Если НЕ ЭлементДанных.Тип = "Страницы" Тогда
// 		Возврат;
// 	КонецЕсли;
// 	Выполнена = Истина;

// 	ИсключаемыеСвойства = СтрРазделить(
// 		"Заголовок", Символы.ПС);

// 	ЭлементДанных.Формат.РазрывСтрок = Истина;

// 	Для Каждого Страница Из ЭлементДанных.Элементы Цикл
// 		Страница.Формат.Результат.Очистить();

// 		Результат = "/" + Страница.НаборСвойств.Заголовок;
// 		Результат = Результат + ФорматироватьНаборСвойств(Страница.НаборСвойств, ИсключаемыеСвойства);
// 		ФорматированиеДобавитьРезультат(ЭлементДанных, Результат);

// 		ПараметрыВыполненияРасчет = НовыеПараметрыФорматирования(ПараметрыВыполнения.РасчетДлины, Страница.Формат.Длина);
// 		ВыполнитьФорматирование(ПараметрыВыполненияРасчет, Страница);

// 		Результат = Новый Массив;
// 		Для Каждого Строка Из Страница.Формат.Результат Цикл
// 			Результат.Добавить("  " + Строка);
// 		КонецЦикла;

// 		ФорматированиеДобавитьРезультат(ЭлементДанных, Результат);
// 	КонецЦикла;
// КонецПроцедуры
