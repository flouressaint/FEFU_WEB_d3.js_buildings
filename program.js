function drawGraph(data) {
  let oyMax = document.getElementById("oyMax").checked;
  let oyMin = document.getElementById("oyMin").checked;
  if (!(oyMax || oyMin)) {
    alert("Выберите одно из значений определения оси OY");
    return;
  }
  // формируем массив для построения диаграммы
  let oxCountry = document.getElementById("oxCountry").checked;
  let oxYear = document.getElementById("oxYear").checked;
  let arrGraph;
  if (oxCountry) {
    arrGraph = getArrGraph(buildings, "Страна", "Высота");
  } else if (oxYear) {
    arrGraph = getArrGraph(buildings, "Год", "Высота");
  }
  let marginX = 50;
  let marginY = 50;
  let height = 400;
  let width = 800;
  let svg = d3.select("svg").attr("height", height).attr("width", width); // очищаем svg перед построением
  svg.selectAll("*").remove();
  // определяем минимальное и максимальное значение по оси OY
  let min = d3.min(arrGraph.map((d) => d.valueMin)) * 0.95;
  let max = d3.max(arrGraph.map((d) => d.valueMax)) * 1.05;
  let xAxisLen = width - 2 * marginX;
  let yAxisLen = height - 2 * marginY;
  // определяем шкалы для осей
  let scaleX = d3
    .scaleBand()
    .domain(
      arrGraph.map(function (d) {
        return d.labelX;
      })
    )
    .range([0, xAxisLen], 1);
  let scaleY = d3.scaleLinear().domain([min, max]).range([yAxisLen, 0]); // создаем оси
  let axisX = d3.axisBottom(scaleX); // горизонтальная
  let axisY = d3.axisLeft(scaleY); // вертикальная
  // отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
  svg
    .append("g")
    .attr("transform", `translate(${marginX}, ${height - marginY})`)
    .call(axisX)
    .attr("class", "x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-45)";
    });
  // отображаем ось OY
  svg
    .append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .attr("class", "y-axis")
    .call(axisY);
  // создаем набор вертикальных линий для сетки
  d3.selectAll("g.x-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", -yAxisLen);
  // создаем горизонтальные линии сетки
  d3.selectAll("g.y-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", xAxisLen)
    .attr("y2", 0);
  // отображаем данные в виде точечной диаграммы
  let dots = document.getElementById("dots").checked;
  let column = document.getElementById("column").checked;
  if (dots) {
    if (oyMax) {
      svg
        .selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
          return scaleX(d.labelX);
        })
        .attr("cy", function (d) {
          return scaleY(d.valueMax);
        })
        .attr(
          "transform",
          `translate(${marginX + scaleX.bandwidth() / 2}, ${marginY})`
        )
        .style("fill", "red");
    }
    if (oyMin) {
      svg
        .selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
          return scaleX(d.labelX);
        })
        .attr("cy", function (d) {
          return scaleY(d.valueMin);
        })
        .attr(
          "transform",
          `translate(${marginX + scaleX.bandwidth() / 2}, ${marginY})`
        )
        .style("fill", "blue");
    }
  } else if (column) {
    if (oyMax) {
      svg
        .selectAll(".column")
        .data(arrGraph)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return scaleX(d.labelX);
        })
        .attr("y", function (d) {
          return scaleY(d.valueMax);
        })
        .attr("width", scaleX.bandwidth())
        .attr("height", function (d) {
          return yAxisLen - scaleY(d.valueMax);
        })
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .style("fill", "red");
    }
    if (oyMin) {
      svg
        .selectAll(".column")
        .data(arrGraph)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return scaleX(d.labelX);
        })
        .attr("y", function (d) {
          return scaleY(d.valueMin);
        })
        .attr("width", scaleX.bandwidth())
        .attr("height", function (d) {
          return yAxisLen - scaleY(d.valueMin);
        })
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .style("fill", "blue");
    }
  }
}

// Входные данные:
// arrObject - исходный массив (например, buildings)
// fieldX - поле, различные значения которого будут отображаться на оси ОХ
// fieldY - поле, минимальное и максимальное значение которого
// вычисляется для каждой метки на оси ОХ // Результат - массив для построения диаграммы
function getArrGraph(arrObject, fieldX, fieldY) {
  // сформируем список меток по оси OX (различные элементы поля fieldX) // см. стр. 8-9 Теоретического материала к ЛР
  let groupObj = d3.group(arrObject, (d) => d[fieldX]);
  arrGroup = []; // массив объектов для построения графика
  for (let entry of groupObj) {
    //выделяем минимальное и максимальное значения поля fieldY //для очередной метки по оси ОХ
    let minMax = d3.extent(entry[1].map((d) => d[fieldY]));
    let elementGroup = {};
    elementGroup.labelX = entry[0];
    elementGroup.valueMin = minMax[0];
    elementGroup.valueMax = minMax[1];
    arrGroup.push(elementGroup);
  }
  return arrGroup;
}

//let createGraph = document.getElementById("graph");
drawGraph();
element = document.getElementById("showTable");
element.onclick = function () {
  if (this.value === "Показать таблицу") {
    this.value = "Скрыть таблицу";
    let thead = [
      "Название",
      "Тип",
      "Страна",
      "Города",
      "Года",
      "Высота",
      "Этажность",
    ];
    // добавление заголовков
    d3.select("div.table")
      .select("table")
      .selectAll("th")
      .data(thead)
      .enter()
      .append("th");

    d3.select("div.table")
      .select("table")
      .selectAll("th")
      .data(thead)
      .html(function (d) {
        return d;
      });

    // заполнение таблицы
    d3.select("div.table")
      .select("table")
      .selectAll("tr")
      .data(buildings)
      .enter()
      .append("tr");

    d3.select("div.table")
      .select("table")
      .selectAll("tr")
      .data(buildings)
      .html(function (d) {
        return `<td>${d["Название"]}</td>
                <td>${d["Тип"]}</td>
                <td>${d["Страна"]}</td>
                <td>${d["Город"]}</td>
                <td>${d["Год"]}</td>
                <td>${d["Высота"]}</td>
                <td>${d["Этажность"]}</td>`;
      });

    d3.select("div.table").select("table").style("display", "");
  } else {
    // скрытие таблицы
    this.value = "Показать таблицу";
    d3.select("div.table").select("table").style("display", "none");
  }
};
