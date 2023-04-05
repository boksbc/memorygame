function Game() {

    var deck = memroydeck();
    var time;

    function init() {
        ThemeSong();
        createDeck();
        ShowDeckActive();
        cardClick();
    }

    function memroydeck() {
        var cards = [
            "src/images/rocket.svg",
            "src/images/tablet.svg",
            "src/images/analytics.svg",
            "src/images/electric_car.svg",
            "src/images/hacker.svg",
            "src/images/programmer.svg",
            "src/images/progress.svg",
            "src/images/two_factor_authentication.svg",
            "src/images/mobile_pay.svg",
            "src/images/shopping.svg",
            "src/images/progress.svg",
            "src/images/credit_card.svg",
        ];

        var game_level = ($("#range_level").val() / 2)
        var new_cards = cards.slice(0, game_level);
        var backcard = ["src/images/backcard.svg"];
        var pairs = new_cards.concat(new_cards);
        shuffleDeck(pairs);

        return {
            cards,
            backcard,
            pairs
        };
    }


    function StartTimer() {

        var timer = 0;
        $(".time").html("00:00:00");

        time = setInterval(function () {
            timer++
            d = Number(timer);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hDisplay = h > 0 ? (h < 10 ? "0" + h + ":" : h + ":") : "00:";
            var mDisplay = m > 0 ? (m < 10 ? "0" + m + ":" : m + ":") : "00:";
            var sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";

            $(".time").html(hDisplay + mDisplay + sDisplay)
        }, 1000);
    }

    function StopTimer() {
        clearInterval(time)
    }

    function createDeck() {
        for (let $i = 0; $i < deck['pairs'].length; $i++) {
            $('.row').append('<div class="cardWrapper closed"></div></div>')
            $('.cardWrapper').html('<div class="facecard"></div>');
            $('.facecard').html('<img class="facecard_img" src=' + deck['backcard'] + '>')
        }
    }

    function ShowDeckActive() {
        if ($("#show_deck").is(":checked")) {
            showDeck();
            setTimeout(function () {
                closeDeck()
                StartTimer();
            }, 3000)
        } else {
            StartTimer();
        }
    }

    function showDeck() {
        $('.facecard').each(function (i) {
            $(this).parent().removeClass('closed').addClass("opened");
            $(this).children().attr("src", deck['pairs'][i])
        })
    }

    function closeDeck() {
        $(".facecard").parent().removeClass('opened').addClass("closed");
        $(".facecard").children().attr("src", deck['backcard'])
    }

    function cardClick() {
        var clicks = 0;
        var hits = 0;
        var openCard = null;

        $(".hit").html(hits);

        $('.facecard').on('click', function () {
            clickSound();
            var $this = $(this);
            var curIndex = $('.facecard').index(this);

            if (clicks === 2) {
                clicks = 0;
            }

            $this.parents(".cardWrapper").removeClass('closed')
                .addClass('opened')
            $this.html('<img class="facecard_img" src=' + deck['pairs'][curIndex] + '>')

            if ($(".opened").length == 2) {
                $(".cardWrapper").addClass("status_event");
            }

            if (clicks === 0) {
                openCard = deck['pairs'][curIndex];
            }

            if (clicks === 1 && openCard === deck['pairs'][curIndex]) {
                $('.opened').removeClass('opened')
                    .addClass('matched');
                $(".cardWrapper").removeClass("status_event");
                correctSound();
            }

            if (clicks === 1 && openCard !== deck['pairs'][curIndex]) {
                setTimeout(function () {
                    $('.opened').removeClass('opened')
                        .addClass('closed')
                        .children(".facecard")
                        .children(".facecard_img").addClass("no_match");
                    $('.no_match').attr("src", deck['backcard'])
                    $(".cardWrapper").removeClass("status_event");
                }, 500)
                wrongSound();
            }

            clicks++
            hits++

            if ($(".cardWrapper").length === $(".matched").length) {
                let result_message = ResultMessages( $(".cardWrapper").length, hits );
                let time = $(".time")[0].innerHTML

                $("#stop").trigger("click")

                StopTimer();
                ResultPopup(hits, time, result_message);

                $(".restart").click(function () {
                    location.reload();
                })
            }
            $(".hit").html(hits);
        });
    }

    function ResultMessages(cards, hits) {
        var message;

        if( hits === cards ) {
            message = "Du bist eine Legende. Alles richtig ONE SHOT!!";
        }
        if( hits >= cards+2 ) {
            message = "Das war ein Top Spiel. Mach so weiter";
        }
        if( hits >= cards+8 ) {
            message = "Nicht schlecht, könnte besser sein.";
        }
        if( hits >= cards+14 ) {
            message = "Hast du einen schlechten Tag? Versuch es noch einmal, das kannst du bestimmt besser."
        }

        return message;
    }

    function ResultPopup(hits, time, result_message) {
        $("body").html("<div id=\"popup\" class=\"popup_container\">\n");
        $(".popup_container").append("<div class=\"popup_wrapper\">\n");
        $(".popup_wrapper").append("<div class=\"popup_headline\"><h1>Glückwunsch zum Sieg</h1></div>\n")
        $(".popup_wrapper").append("<div class=\"popup_results\"></div>\n");
        $(".popup_results").append("<div class=\"result result_hits\"><h4>Züge</h4><span>"+ hits +"</span></div>\n")
        $(".popup_results").append("<div class=\"result result_time\"><h4>Zeit</h4><span>"+ time +"</span></div>\n")
        $(".popup_wrapper").append("<div class=\"result-message\"></div>\n");
        $(".result-message").append("<span>" + result_message + "</span>\n");

        $(".popup_wrapper").append("<div class=\"restart_submit\"></div>\n");
        $(".restart_submit").append("<button class=\"restart\" type=\"submit\">Spiel neustarten</button>\n");
    }

    function shuffleDeck(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function resizeDeck() {
        $deck = $('.facecard');
        $deck.css('height', $deck.innerWidth())

        $(window).resize(function () {
            $deck = $('.facecard');
            $deck.css('height', $deck.innerWidth())
        });
    }

    function clickSound() {
        var audio = new Audio('src/media/click.wav');
        audio.play();
        audio.currentTime = 0;
        audio.volume = 0.2
    }

    function correctSound() {
        var audio = new Audio('src/media/correct.wav');
        audio.play();
        audio.currentTime = 0;
        audio.volume = 0.2
    }

    function wrongSound() {
        var audio = new Audio('src/media/wrong.wav');
        audio.play();
        audio.currentTime = 0;
        audio.volume = 0.1
    }

    function ThemeSong() {
        var audio = new Audio('src/media/Theme_Song.mp3');

        $("#play").click(function () {
            audio.play();
            audio.muted = false;
            audio.volume = 0.05
            $(".music_buttons > div").removeClass("headline_span")
            $(this).addClass("headline_span")
        })

        $("#stop").click(function () {
            audio.pause();
            audio.currentTime = 0;
            $(".music_buttons > div").removeClass("headline_span")
            $(this).addClass("headline_span")
        })

        $("#mute").click(function () {
            audio.muted = true;
            $(".music_buttons > div").removeClass("headline_span")
            $(this).addClass("headline_span")
        })

    }

    return {
        "init": init,
        "ThemeSong": ThemeSong,
    };
}


$(document).ready(function () {
    $(".start").click(function () {
        var game = new Game();
        game.init();

        $("#play").trigger("click");
        $("#popup").remove();
        $(".disNon").removeClass("disNon");
    })
})
