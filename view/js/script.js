var modal;
var player;

var floatLeft = "";
var floatTop = "";
var floatWidth = "";
var floatHeight = "";

var changingVideoFloat = 0;
var floatClosed = 0;
var fullDuration = 0;
var isPlayingAd = false;

var mainVideoHeight = 0;
var doNotFloatVideo = false;

var mouseX;
var mouseY;
$(document).mousemove(function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

String.prototype.stripAccents = function () {
    var translate_re = /[àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ]/g;
    var translate = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    return (this.replace(translate_re, function (match) {
        return translate.substr(translate_re.source.indexOf(match) - 1, 1);
    })
            );
};
function clean_name(str) {

    str = str.stripAccents().toLowerCase();
    return str.replace(/[!#$&'()*+,/:;=?@[\] ]+/g, "-");
}


try {
    if ($(".thumbsJPG").length) {
        $('.thumbsJPG').lazy({
            effect: 'fadeIn',
            visibleOnly: true,
            // called after an element was successfully handled
            afterLoad: function (element) {
                element.removeClass('blur');
            }
        });
    }
} catch (e) {
}

var pleaseWaitIsINUse = false;
$(document).ready(function () {
    modal = modal || (function () {
        var pleaseWaitDiv = $("#pleaseWaitDialog");
        if (pleaseWaitDiv.length === 0) {
            pleaseWaitDiv = $('<div id="pleaseWaitDialog" class="modal fade"  data-backdrop="static" data-keyboard="false"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><h2>Processing...</h2><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div></div></div></div></div>').appendTo('body');
        }

        return {
            showPleaseWait: function () {
                if (pleaseWaitIsINUse) {
                    return false;
                }
                pleaseWaitIsINUse = true;
                pleaseWaitDiv.modal();
            },
            hidePleaseWait: function () {
                pleaseWaitDiv.modal('hide');
                pleaseWaitIsINUse = false;
            },
            setProgress: function (valeur) {
                pleaseWaitDiv.find('.progress-bar').css('width', valeur + '%').attr('aria-valuenow', valeur);
            },
            setText: function (text) {
                pleaseWaitDiv.find('h2').html(text);
            },
        };
    })();

    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    $(".thumbsImage").on("mouseenter", function () {
        gifId = $(this).find(".thumbsGIF").attr('id');
        $(".thumbsGIF").fadeOut();
        if (gifId != undefined) {
            id = gifId.replace('thumbsGIF', '');
            $(this).find(".thumbsGIF").height($(this).find(".thumbsJPG").height());
            $(this).find(".thumbsGIF").width($(this).find(".thumbsJPG").width());
            try {
                $(this).find(".thumbsGIF").lazy({effect: 'fadeIn'});
            } catch (e) {
            }
            $(this).find(".thumbsGIF").stop(true, true).fadeIn();
        }
    });

    $(".thumbsImage").on("mouseleave", function () {
        $(this).find(".thumbsGIF").stop(true, true).fadeOut();
    });

    if ($(".thumbsJPG").length) {
        $('.thumbsJPG').lazy({
            effect: 'fadeIn',
            visibleOnly: true,
            // called after an element was successfully handled
            afterLoad: function (element) {
                element.removeClass('blur');
            }
        });
    }
    mainVideoHeight = $('#videoContainer').innerHeight();
    $(window).resize(function () {
        mainVideoHeight = $('#videoContainer').innerHeight();
    });
    $(window).scroll(function () {
        if (changingVideoFloat || doNotFloatVideo) {
            return false;
        }
        changingVideoFloat = 1;
        var s = $(window).scrollTop();
        if (s > mainVideoHeight) {
            if (!$('#videoContainer').hasClass("floatVideo") && !floatClosed) {
                $('#videoContainer').hide();
                $('#videoContainer').addClass('floatVideo');
                $('#videoContainer').parent().css('height', mainVideoHeight);
                if (parseInt(floatTop) < 70) {
                    floatTop = "70px";
                }
                if (parseInt(floatLeft) < 10) {
                    floatLeft = "10px";
                }
                $("#videoContainer").css({"top": floatTop});
                $("#videoContainer").css({"left": floatLeft});
                $("#videoContainer").css({"height": floatHeight});
                $("#videoContainer").css({"width": floatWidth});

                $("#videoContainer").resizable({
                    aspectRatio: 16 / 9,
                    minHeight: 150,
                    minWidth: 266
                });
                $("#videoContainer").draggable({
                    handle: ".move",
                    containment: ".principalContainer"
                });
                changingVideoFloat = 0;
                $('#videoContainer').fadeIn();
                $('#floatButtons').fadeIn();
            } else {
                changingVideoFloat = 0;
            }
        } else {
            floatClosed = 0;
            if ($('#videoContainer').hasClass("floatVideo")) {
                closeFloatVideo();
            } else {
                changingVideoFloat = 0;
            }
        }
    });

    $("a").each(function () {
        var location = window.location.toString()
        var res = location.split("?");
        pathWitoutGet = res[0];
        if ($(this).attr("href") == window.location.pathname
                || $(this).attr("href") == window.location
                || $(this).attr("href") == pathWitoutGet) {
            $(this).addClass("selected");
        }
    });


    $('#clearCache, .clearCacheButton').on('click', function (ev) {
        ev.preventDefault();
        modal.showPleaseWait();
        $.ajax({
            url: webSiteRootURL + 'objects/configurationClearCache.json.php',
            success: function (response) {
                if (!response.error) {
                    swal("Congratulations!", "Your cache has been cleared!", "success");
                } else {
                    swal("Sorry!", "Your cache has NOT been cleared!", "error");
                }
                modal.hidePleaseWait();
            }
        });
    });

    $('.clearCacheFirstPageButton').on('click', function (ev) {
        ev.preventDefault();
        modal.showPleaseWait();
        $.ajax({
            url: webSiteRootURL + 'objects/configurationClearCache.json.php?FirstPage=1',
            success: function (response) {
                if (!response.error) {
                    swal("Congratulations!", "Your First Page cache has been cleared!", "success");
                } else {
                    swal("Sorry!", "Your First Page cache has NOT been cleared!", "error");
                }
                modal.hidePleaseWait();
            }
        });
    });

    $('#generateSiteMap, .generateSiteMapButton').on('click', function (ev) {
        ev.preventDefault();
        modal.showPleaseWait();
        $.ajax({
            url: webSiteRootURL + 'objects/configurationGenerateSiteMap.json.php',
            success: function (response) {
                if (!response.error) {
                    swal("Congratulations!", "File created!", "success");
                } else {
                    swal("Sorry!", "File NOT created!", "error");
                }
                modal.hidePleaseWait();
            }
        });
    });

});

function removeTracks() {
    var oldTracks = player.remoteTextTracks();
    var i = oldTracks.length;
    while (i--) {
        player.removeRemoteTextTrack(oldTracks[i]);
    }
}

function changeVideoSrc(vid_obj, source) {
    var srcs = [];
    removeTracks();
    for (i = 0; i < source.length; i++) {
        if (source[i].type) {
            srcs.push(source[i]);
        } else if (source[i].srclang) {
            player.addRemoteTextTrack(source[i]);
        }
    }
    vid_obj.src(srcs);
    setTimeout(function () {
        changeVideoSrcLoad();
    }, 1000);
}

function changeVideoSrcLoad() {
    console.log("changeVideoSrcLoad: Try to load player");
    player.load();
    player.ready(function () {
        console.log("changeVideoSrcLoad: Player ready");
        var err = this.error();
        if (err && err.code) {
            console.log("changeVideoSrcLoad: Load player Error");
            setTimeout(function () {
                changeVideoSrcLoad();
            }, 1000);
        } else {
            console.log("changeVideoSrcLoad: Load player Success, Play");
            setTimeout(function () {
                player.load();
                player.play();
            }, 1000);
        }
    });
    ;
}


/**
 *
 * @param {String} str 00:00:00
 * @returns {int} int of seconds
 */
function strToSeconds(str) {
    var partsOfStr = str.split(':');
    var seconds = parseInt(partsOfStr[2]);
    seconds += parseInt(partsOfStr[1]) * 60;
    seconds += parseInt(partsOfStr[0]) * 60 * 60;
    return seconds;
}

/**
 *
 * @param {int} seconds
 * @param {int} level 3 = 00:00:00 2 = 00:00 1 = 00
 * @returns {String} 00:00:00
 */
function secondsToStr(seconds, level) {
    var hours = parseInt(seconds / (60 * 60));
    var minutes = parseInt(seconds / (60));
    seconds = parseInt(seconds % (60));
    hours = hours > 9 ? hours : "0" + hours;
    minutes = minutes > 9 ? minutes : "0" + minutes;
    seconds = seconds > 9 ? seconds : "0" + seconds;
    switch (level) {
        case 3:
            return hours + ":" + minutes + ":" + seconds;
            break;
        case 2:
            return minutes + ":" + seconds;
            break;
        case 1:
            return seconds;
            break;
        default:
            return hours + ":" + minutes + ":" + seconds;
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function subscribe(email, user_id) {
    $.ajax({
        url: webSiteRootURL + 'objects/subscribe.json.php',
        method: 'POST',
        data: {
            'email': email,
            'user_id': user_id
        },
        success: function (response) {
            if (response.subscribe == "i") {
                $('.subs' + user_id).removeClass("subscribed");
                $('.subs' + user_id + ' b.text').text("Subscribe");
                $('b.textTotal' + user_id).text(parseInt($('b.textTotal' + user_id).first().text()) - 1);
            } else {
                $('.subs' + user_id).addClass("subscribed");
                $('.subs' + user_id + ' b.text').text("Subscribed");
                $('b.textTotal' + user_id).text(parseInt($('b.textTotal' + user_id).first().text()) + 1);
            }
            $('#popover-content #subscribeEmail').val(email);
            $('.subscribeButton' + user_id).popover('hide');
        }
    });
}

function subscribeNotify(email, user_id) {
    $.ajax({
        url: webSiteRootURL + 'objects/subscribeNotify.json.php',
        method: 'POST',
        data: {
            'email': email,
            'user_id': user_id
        },
        success: function (response) {
            if (response.notify) {
                $('.notNotify' + user_id).addClass("hidden");
                $('.notify' + user_id).removeClass("hidden");
            } else {
                $('.notNotify' + user_id).removeClass("hidden");
                $('.notify' + user_id).addClass("hidden");
            }
        }
    });
}

function closeFloatVideo() {
    $('#videoContainer').fadeOut('fast', function () {
        // this is to remove the dragable and resize
        floatLeft = $("#videoContainer").css("left");
        floatTop = $("#videoContainer").css("top");
        floatWidth = $("#videoContainer").css("width");
        floatHeight = $("#videoContainer").css("height");
        $("#videoContainer").css({"top": ""});
        $("#videoContainer").css({"left": ""});
        $("#videoContainer").css({"height": ""});
        $("#videoContainer").css({"width": ""});

        $('#videoContainer').parent().css('height', '');
        $('#videoContainer').removeClass('floatVideo');
        $("#videoContainer").resizable('destroy');
        $("#videoContainer").draggable('destroy');
        $('#floatButtons').hide();
        changingVideoFloat = 0;
    });
    $('#videoContainer').fadeIn();
}


function mouseEffect() {

    $(".thumbsImage").on("mouseenter", function () {
        try {
            $(this).find(".thumbsGIF").lazy({effect: 'fadeIn'});
        } catch (e) {
        }
        $(this).find(".thumbsGIF").height($(this).find(".thumbsJPG").height());
        $(this).find(".thumbsGIF").width($(this).find(".thumbsJPG").width());
        $(this).find(".thumbsGIF").stop(true, true).fadeIn();
    });

    $(".thumbsImage").on("mouseleave", function () {
        $(this).find(".thumbsGIF").stop(true, true).fadeOut();
    });
}

function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

var last_videos_id = 0;
var last_currentTime = -1;
function addView(videos_id, currentTime) {
    if (last_videos_id == videos_id && last_currentTime == currentTime) {
        return false;
    }
    last_videos_id = videos_id;
    last_currentTime = currentTime;
    $.ajax({
        url: webSiteRootURL + 'objects/videoAddViewCount.json.php',
        method: 'POST',
        data: {
            'id': videos_id,
            'currentTime': currentTime
        },
        success: function (response) {
            $('.view-count' + videos_id).text(response.count);
        }
    });
}

function getPlayerButtonIndex(name) {
    var children = player.getChild('controlBar').children();
    for (i = 0; i < children.length; i++) {
        if (children[i].name_ === name) {
            return i;
        }
    }
    return children.length;
}


function copyToClipboard(text) {

    $('#elementToCopy').css({'top': mouseY, 'left': mouseX}).fadeIn('slow');
    $('#elementToCopy').val(text);
    $('#elementToCopy').focus();
    $('#elementToCopy').select();
    document.execCommand('copy');
}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
var promisePlaytry = 10;
var promisePlayTimeoutTime = 0;
var promisePlayTimeout;
var promisePlay;
function playerPlay(currentTime) {
    if (promisePlaytry <= 0) {
        return false;
    }
    promisePlaytry--;
    if (typeof player !== 'undefined') {
        promisePlayTimeoutTime += 1000;
        if (currentTime) {
            player.currentTime(currentTime);
        }
        try {
            console.log("playerPlay: Trying to play");
            promisePlay = player.play();
            if (promisePlay !== undefined) {
                promisePlayTimeout = setTimeout(function () {
                    console.log("playerPlay: Promise is Pending, try again");
                    playerPlay(currentTime);
                }, promisePlayTimeoutTime);
                console.log("playerPlay: promise found");
                promisePlay.then(function () {
                    console.log("playerPlay: Autoplay started");
                    clearTimeout(promisePlayTimeout);
                    setTimeout(function () {
                        if (player.paused()) {
                            console.log("The video still paused, trying to mute and play");
                            player.muted(true);
                            playerPlay(currentTime);
                        } else {
                            if (player.muted() && !inIframe()) {
                                swal({
                                    html: true,
                                    title: "Your Media is Muted",
                                    text: "<b>Would</b> you like to unmute it?<div id='allowAutoplay' style='max-height: 100px; overflow-y: scroll;'></div>",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Yes, unmute it!",
                                    closeOnConfirm: true
                                },
                                        function () {
                                            player.muted(false);
                                        });
                                setTimeout(function () {
                                    $("#allowAutoplay").load(webSiteRootURL + "plugin/PlayerSkins/allowAutoplay/");
                                }, 500);

                            }
                        }

                    }, 1000);
                }).catch(function (error) {
                    console.log("playerPlay: Autoplay was prevented, trying to mute and play ***");
                    player.muted(true);
                    playerPlay(currentTime);

                });
            } else {
                promisePlayTimeout = setTimeout(function () {
                    if (player.paused()) {
                        console.log("playerPlay: promise Undefined");
                        playerPlay(currentTime);
                    }
                }, promisePlayTimeoutTime);
            }
        } catch (e) {
            console.log("playerPlay: We could not autoplay, trying again in 1 second");
            promisePlayTimeout = setTimeout(function () {
                playerPlay(currentTime);
            }, promisePlayTimeoutTime);
        }
    } else {
        console.log("playerPlay: Player is Undefined");
    }
}
