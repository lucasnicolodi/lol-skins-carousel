$.getJSON(
  "http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/champion.json",
  function (data) {
    /* pegando informações do API */
    // console.log(data);
    const entries = Object.entries(data.data);
    // console.log(entries);

    /* criando array com os nomes de cada campeão */
    let championsnames = [];
    for (let i = 0; i < entries.length; i++) {
      championsnames.push(entries[i][0]);
    }

    // console.log(championsnames);

    /* criando as opções da lista de seleção com base na array championsnames */
    var options = "";

    for (var i = 0; i < championsnames.length; i++) {
      options +=
        '<option value="' +
        championsnames[i] +
        '">' +
        championsnames[i] +
        "</option>";
    }
    const newLocal = "#select-champion";
    $(newLocal).html(options);

    /* Adicionando o atributo "selected" para os que foram seleciondaos na lista */
    $("#select-champion").change(function () {
      $("#select-champion option:selected").attr("selected", "selected");
      $("#select-champion option")
        .not("option:selected")
        .removeAttr("selected");
    });

    /* Criando um botão para cada personagem */
    function buttonForChampion() {
      var more = document.getElementById("champion-button");
      for (var i = 0; i < championsnames.length; i++) {
        var butt = document.createElement("button");
        butt.value = championsnames[i];
        butt.style =
          "background: url('http://ddragon.leagueoflegends.com/cdn/12.1.1/img/champion/" +
          championsnames[i] +
          ".png')";
        more.appendChild(butt);
      }
    }

    buttonForChampion();

    $("#champion-button button").click(function () {
      // document.getElementById("carousel-track").removeChild();
      $("#carousel-track").empty();
    });

    /* criando uma list com todas as skins de cada campeão clicado */

    $("#champion-button button").on("click", function () {
      var selectedChampion = $(this).val();
      $.getJSON(
        "http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/champion/" +
          selectedChampion +
          ".json",
        function (data) {
          const entries = Object.entries(data.data);
          var amountSkinPerChamp = entries[0][1].skins.length;
          // console.log(amountSkinPerChamp);

          var arraySkinPerChamp = [];

          for (var i = 0; i < amountSkinPerChamp; i++) {
            var skinPerChampList = Object.entries(entries[0][1].skins);
            arraySkinPerChamp.push(skinPerChampList[i][1].name);
          }

          var numSkinPerChamp = [];

          for (var i = 0; i < amountSkinPerChamp; i++) {
            var skinPerChampList = Object.entries(entries[0][1].skins);
            numSkinPerChamp.push(skinPerChampList[i][1].num);
          }

          console.log(arraySkinPerChamp);
          console.log(numSkinPerChamp);

          /* Criando um li com img para cada skin de personagem */

          function skinsCardPerChamp() {
            var more = document.getElementById("carousel-track");
            var widthPercentage = amountSkinPerChamp * 100;
            more.style.width = widthPercentage + "%";
            for (var i in numSkinPerChamp) {
              var listItem = document.createElement("li");
              listItem.class = "carousel-slide";
              more.appendChild(listItem);
              var imgListItem = document.createElement("img");
              imgListItem.src =
                "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
                selectedChampion +
                "_" +
                numSkinPerChamp[i] +
                ".jpg";
              listItem.appendChild(imgListItem);
            }
          }

          skinsCardPerChamp();

          const prev = $(".left");
          const next = $(".right");
          const slider = document.querySelector(".carousel-track");
          var translatePercentage = 100 / amountSkinPerChamp;
          var direction;

          prev.on("click", function () {
            if (direction == -1) {
              slider.appendChild(slider.firstElementChild);
              direction = 1;
            }
            document.querySelector(
              ".carousel-track-container"
            ).style.justifyContent = "flex-end";
            slider.style.transform = "translate(" + translatePercentage + "%)";
          });

          next.on("click", function () {
            direction = -1;
            document.querySelector(
              ".carousel-track-container"
            ).style.justifyContent = "flex-start";
            slider.style.transform =
              "translate( -" + translatePercentage + "%)";
          });

          $(".carousel-track").on(
            "transitionend webkitTransitionEnd oTransitionEnd",
            function () {
              if (direction == -1) {
                slider.appendChild(slider.firstElementChild);
              } else if (direction == 1) {
                slider.prepend(slider.lastElementChild);
              }

              slider.style.transition = "none";
              slider.style.transform = "translate(0)";
              setTimeout(function () {
                slider.style.transition = "all 0.5s";
              });
            }
          );
        }
      );
    });
  }
);
