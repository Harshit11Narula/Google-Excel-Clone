const $ = require("jquery");
const electron = require("electron").remote;
const fsp = require("fs").promises;
const dialog = electron.dialog;

$(document).ready(function () {
  let rows = [];
  let lso , lrid , lcid;
  function getDefaultCell() {
    let cell = {
      val: "",
      fontFamily: "Georgia",
      fontSize: 10,
      bold: false,
      italic: false,
      underline: false,
      bgColor: "#FFFFFF",
      textColor: "#000000",
      halign: "left",
      valign: "center",
      formula: "",
      upstream: [],
      downstream: []
    };
    return cell;
  }

  function prepareCellDiv(cdiv, cobj) {
    $(cdiv).html(cobj.val);
    $(cdiv).css("font-family", cobj.fontFamily);
    $(cdiv).css("font-size", cobj.fontSize + "px");
    $(cdiv).css("font-weight", cobj.bold ? "bold" : "normal");
    $(cdiv).css("text-decoratoin", cobj.underline ? "underline" : "none");
    $(cdiv).css("font-style", cobj.italic ? "italic" : "normal");
    $(cdiv).css("background-color", cobj.bgColor);
    $(cdiv).css("color", cobj.textColor);
    $(cdiv).css("text-alogn", cobj.halign);
  }

  $("#content-container").on("scroll", function () {
    var t = $("#content-container").scrollTop();
    var l = $("#content-container").scrollLeft();
    $("#first-row").css("top", t);
    $("#first-column").css("left", l);
    $("#tl-cell").css("top", t);
    $("#tl-cell").css("left", l);
  });

  $("#new").on("click", function () {
    // $('#grid').find('.row').each(function () {
    //   $(this).find('.cell').each(function () {
    //     $(this).html('');
    //    })
    //  })
    let fc = null;
    $("#grid")
      .find(".row")
      .each(function () {
        let cells = [];

        $(this)
          .find(".cell")
          .each(function () {
            let cell = getDefaultCell();
            cells.push(cell);
            prepareCellDiv(this, cell);
            // fc = fc || this;
            // $(this).find('.cell-content').html(cell.val);
          });
        rows.push(cells);
      });
    $("grid .cell:first").click();
    $("#home-menu").click();
  });

  $("#open").on("click", async function () {
    let dobj = await dialog.showOpenDialog();

    if (dobj.canceled) {
      return;
    } else if (dobj.filePaths.length === 0) {
      alert("Please select a file");
      return;
    } else {
      let data = await fsp.readFile(dobj.filePaths[0]);
      let rows = JSON.parse(data);

      let i = 0;
      $("#grid")
        .find(".row")
        .each(function () {
          let j = 0;
          $(this)
            .find(".cell")
            .each(function () {
              $(this).html(rows[i][j].val);
              j++;
            });
          i++;
        });
    }
  });

  $("#save").on("click", async function () {
    let data = JSON.stringify(rows);
    let dobj = await dialog.showSaveDialog();
    await fsp.writeFile(dobj.filePath, data);
    alert("save success");
    $("#home-menu").click();
  });

  $("#menu-bar > div").on("click", function () {
    $("#menu-bar").removeClass("selected");
    $(this).addClass("selected");

    let menuContainerId = $(this).attr("data-content");
    $("#menu-content-container > div").css("display", "none");
    $("#" + menuContainerId).css("display", "flex");
  });

  $("#bold").on("click", function () {
    $(this).toggleClass("selected");
    let bold = $(this).hasClass("selected");
    $("#grid .cell.selected").each(function () {
      $(this).css("font-weight", bold ? "bold" : "normal");
      let rid = parseInt($(this).attr("rid"), 10);
      let cid = parseInt($(this).attr("cid"), 10);
      let cell = rows[rid][cid];
      cell.bold = bold;
    });
  });

  $("#italic").on("click", function () {
    $(this).toggleClass("selected");
    let italic = $(this).hasClass("selected");
    $("#grid .cell.selected").each(function () {
      $(this).css("font-style", italic ? "italic" : "normal");
      let rid = parseInt($(this).attr("rid"), 10);
      let cid = parseInt($(this).attr("cid"), 10);
      let cell = rows[rid][cid];
      cell.italic = italic;
    });
  });

  $("#underline").on("click", function () {
    $(this).toggleClass("selected");
    let underline = $(this).hasClass("selected");
    $("#grid .cell.selected").each(function () {
      $(this).css("text-decoration", underline ? "underline" : "none");
      let rid = parseInt($(this).attr("rid"), 10);
      let cid = parseInt($(this).attr("cid"), 10);
      let cell = rows[rid][cid];
      cell.underline = underline;
    });
  });
  $("#text-color").on("change", function () {
    let textcolor = $(this).val();
    $("#grid .cell.selected").each(function () {
      $(this).css("color", textcolor);
      let rid = parseInt($(this).attr("rid"));
      let cid = parseInt($(this).attr("cid"));
      let cell = rows[rid][cid];
      cell.textColor = textcolor;
    });
  });
  $("#font-size").on("change", function () {
    let fontsize = $(this).val();
    $("#grid .cell.selected").each(function () {
      $(this).css("font-size", fontsize);
      let rid = parseInt($(this).attr("rid"));
      let cid = parseInt($(this).attr("cid"));
      let cell = rows[rid][cid];
      cell.fontSize = fontsize;
    });
  });
  $("#bg-color").on("change", function () {
    let bgColor = $(this).val();
    $("#grid .cell.selected").each(function () {
      $(this).css("background-color", bgColor);
      let rid = parseInt($(this).attr("rid"));
      let cid = parseInt($(this).attr("cid"));
      let cell = rows[rid][cid];
      cell.bgColor = bgColor;
    });
  });

  $(".valign").on("click", function () {
    $(".valign").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".halign").on("click", function () {
    $(".halign").removeClass("selected");
    $(this).addClass("selected");

    let halign = $(this).attr("prop-val");
    $("#grid .cell.selected").each(function () {
      $(this).css("text-align", halign);
      let rid = parseInt($(this).attr("rid"));
      let cid = parseInt($(this).attr("cid"));
      let cell = rows[rid][cid];
      cell.halign = halign;
    });
  });



  $("#grid .cell").on("click", function (e) {
    
    if (e.ctrlKey) {
      $(this).addClass("selected");
    } else {
      $("#grid .cell").removeClass("selected");
      $(this).addClass("selected");
    }
    let rid = parseInt($(this).attr("rid"), 10);
    let cid = parseInt($(this).attr("cid"), 10);
    let cell = rows[rid][cid];
    lso = cell;
    lrid = rid;
    lcid = cid;

    $("#font-type").val(cell.fontFamily);
    $("font-size").val(cell.fontSize);
    if (cell.bold) {
      $("#bold").addClass("selected");
    } else {
      $("#bold").removeClass("selected");
    }
    if (cell.italic) {
      $("#italic").addClass("selected");
    } else {
      $("#italic").removeClass("selected");
    }
    if (cell.underline) {
      $("#underline").addClass("selected");
    } else {
      $("#underline").removeClass("selected");
    }
    $("#bg-color").val(cell.bgColor);
    $("#text-color").val(cell.textColor);
    $(".valign").removeClass("selected");
    $(".valign[prop-val=" + cell.valign + "]").addClass("selected");
    $(".halign").removeClass("selected");
    $(".halign[prop-val=" + cell.halign + "]").addClass("selected");
    $("#cellformula").val(String.fromCharCode(cid + 65) + (rid + 1));
    $("#txtformula").val(cell.formula);
  });

  function evalute(cell) {
    formula = cell.formula;
    for (let j = 0; j < cell.upstream.length; j++) {
      let uso = cell.upstream[j];
      let fuso = rows[uso.rid][uso.cid];
      let cellname =
        String.fromCharCode("A".charCodeAt(0) + uso.cid) + (uso.rid + 1);

      formula = formula.replace(cellname, fuso.val || 0);

    }
    let nval = eval(formula);
    return nval;
  }

  function updateval(rid, cid, val, flag) {
    let cell = rows[rid][cid];
    cell.val = val;
    if (flag == true) {
     $(".cell[rid=" + rid + "][cid=" + cid + "]").html(val);
    }
    for (let i = 0; i < cell.downstream.length; i++) {
      let dobj = cell.downstream[i];
      let fdso = rows[dobj.rid][dobj.cid];
      let nval = evalute(fdso);
      updateval(dobj.rid, dobj.cid, nval, true);
    }
  }

  function deleteformula(rid , cid) {
    let cell = rows[rid][cid];
    cell.formula = "";
    // delete formula and update upstream
    for (let i = 0; i < cell.upstream.length; i++) {
      let uobj = cell.upstream[i];
      let fobj = rows[uobj.rid][uobj.cid];
      for (let j = 0; j < fobj.downstream.length; j++) {
        let dso = fobj.downstream[j];
        if (dso.rid == rid && dso.cid == cid) {
          fobj.downstream.splice(j, 1);
          break;
        }
      }
    }
      cell.upstream = [];
  }

  $("#grid .cell").on("keyup", function (e) { 
    let rid = parseInt($(this).attr("rid"), 10);
    let cid = parseInt($(this).attr("cid"), 10);
    let cell = rows[rid][cid];

    if (cell.formula) {
      $("#txtformula").val("");
      deleteformula(rid, cid);
    }
    // console.log("call here");
    updateval(rid, cid, $(this).html(), false);
  });

  $("#txtformula").on("blur", function () {
    let tformula = $(this).val();

    $('#grid .cell.selected').each(function () { 
    let rid = parseInt($(this).attr('rid'));
    let cid = parseInt($(this).attr('cid'));
    let cell = rows[rid][cid];
    // remove old value
    if (cell.formula) {
      deleteformula(rid, cid);
    }
    
    // set upstream-downstream
    cell.formula = tformula;
      
    // console.log(cell.formula);
    let formula = cell.formula;
    formula = formula.replace("(", "").replace(")", "");
    let comps = formula.split(" ");
    for (let j = 0; j < comps.length; j++) {
      
      if (
        comps[j].charCodeAt(0) >= "A".charCodeAt(0) &&
        comps[j].charCodeAt(0) <= "Z".charCodeAt(0)
      ) {
        let urid = parseInt(comps[j].substr(1)) - 1;
        let ucid = comps[j].charCodeAt(0) - "A".charCodeAt(0);
        cell.upstream.push({ rid: urid, cid: ucid });
        let fuobj = rows[urid][ucid];
        fuobj.downstream.push({
          rid: rid,
          cid: cid,
        });
      }
    }
    // evalute
    let nval = evalute(cell);
    updateval(rid, cid, nval, true);
    });
  });

  $("#new").click();
});

// $(window).on("load resize", function () {
//   let ht = parseInt($(window).outerHeight()) - 61;
//   $("#content-container").height(ht + "px");
//   console.log();
// })
