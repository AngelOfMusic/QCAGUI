

navigator.browserType = (function(){
    var N = navigator.appName, ua = navigator.userAgent, tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) {M[2]=tem[1];}
    //M = M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    M = M? M[1] : N;
    return M;
})();




$.extend($.fn.disableTextSelection = function() {
    return this
         .attr('unselectable', 'on')
         .css('user-select', 'none')
         .on('selectstart', false);
    
});




function addDiv(olddiv, newdiv, settings) {
    var div1 = document.getElementById(olddiv);
    var div2 = document.createElement("div");
    
    div2.id = newdiv + ((settings.border)?"_border":"");
    
    div1.appendChild(div2);
    
    $("#" + div2.id).css({
        position: "absolute",
        left:     (settings.left   + "px"),
        top:      (settings.top    + "px"),
        width:    (settings.width  + "px"),
        height:   (settings.height + "px")
    });
    
    if (settings.border) {
        
        var div3 = document.getElementById(newdiv + "_border");
        var div4 = document.createElement("div");
        div4.id = newdiv;
        div3.appendChild(div4);
        
        $("#" + newdiv).css({
            "max-height": (settings.height + "px"),
            "overflow-x": "hidden",
            "overflow-y": ((newdiv == "impath" || newdiv == "expath")?"hidden":"auto")
        });
        
        if (newdiv != "impath" && newdiv != "expath" && newdiv != "direxp") {
            $("#" + newdiv + "_border").addClass("border");
        }
    }
    
}




/* --------------------------------------------------------------------- */




// modified version of http://mech.fsv.cvut.cz/~stransky/en/software/raphaeltools/
Raphael.fn.checkBox = function(x, y, isChecked, label, dim, fontsize) {
    
    if (dim == void 0) {
        dim = 12;
    }
    
    if (fontsize == void 0) {
        fontsize = 14;
    }
    
    var cb = new Array();
    cb.active = true;
    cb.label = new Array(1);
    cb.label[0] = this.text(x + 20, y + 5, label)
        .attr({"text-anchor": "start", "font-size": (fontsize + "px")});
    
    cb.box = this.rect(x, y, dim, dim)
        .attr({fill: isChecked?"#97bd6c":"#eeeeee","stroke-width": 1.2, stroke: "#a0a0a0"});
    
    cb.chk = this.path([
        ["M", x + 0.2*dim, y + 0.3*dim],
        ["l", 0.15*dim*2, 0.2*dim*2],
        ["l", 0.3*dim*2, -0.45*dim*2]
    ]).attr({"stroke-width": 2});
    
        
    if (isChecked) {
        cb.box.attr({fill: "#97bd6c"});
        cb.chk.show();
    }
    else {
        cb.box.attr({fill: "#eeeeee"});
        cb.chk.hide();
    }
    
    cb.isChecked = isChecked;
    
    
    cb.cover = this.rect(x, y, dim, dim)
        .attr({fill: "#000", opacity: 0, cursor: "pointer"})
        .click(function() {
            if (cb.active) {
                cb.isChecked = !cb.isChecked;
                this.isChecked = cb.isChecked;
                
                if (cb.isChecked) {
                    cb.box.attr({fill: "#97bd6c"});
                    cb.chk.show();
                }
                else {
                     cb.box.attr({fill: "#eeeeee"});
                     cb.chk.hide();
                }
            }
        });
    
        
    cb.activate = function() {
        cb.active = true;
        cb.cover.attr({fill: "#000", opacity: 0, cursor: "pointer"});
    }
    
        
    cb.deactivate = function() {
        cb.active = false;
        cb.cover.attr({fill: "#000", opacity: 0, cursor: "default"});
    }
        
        
    cb.uncheck = function() {
        cb.isChecked = false;
        cb.box.attr({fill: "#eeeeee"});
        cb.chk.hide();
        cb.cover.isChecked = false;
    }
    
      
    cb.check = function() {
        cb.isChecked = true;
        cb.box.attr({fill: "#97bd6c"});
        cb.chk.show();
        cb.cover.isChecked = true;
    }
    
    cb.hideIt = function() {
        cb.cover.hide();
        cb.box.hide();
        cb.chk.hide();
        for (var i = 0; i < cb.label.length; i++) {
            cb.label[i].hide();
        }
    }
    
    
    cb.showIt = function() {
        cb.cover.show();
        cb.box.show();
        
        if (cb.isChecked) {
            cb.chk.show();
        }
        else {
            cb.chk.hide();
        }
        
        for (var i = 0; i < cb.label.length; i++) {
            cb.label[i].show();
        }
    }
    
    var cbset = this.set(cb.box, cb.chk, cb.cover);
    
    cb.move = function(x, y) {
        cbset.transform("t" + x + "," + y);
    }
    
    return(cb);
    
}



/* --------------------------------------------------------------------- */



Raphael.fn.radio = function(x, y, whichChecked, labels, vertspace, horspace, size, fontsize) {
    
    if (size == void 0) {
        size = 6.5;
    }
    
    if (vertspace == void 0) {
        vertspace = 25;
    }
    
    if (horspace == void 0) {
        horspace = 14;
    }
    
    if (fontsize == void 0) {
        fontsize = 14;
    }
    
    var rd = new Array();
    
    rd.whichChecked = whichChecked;
    rd.label = new Array(labels.length);
    rd.cover = new Array(labels.length);
    rd.circle = new Array(labels.length);
    rd.fill = this.set();
    
    var newvert = 0;
    
    for (var i = 0; i < labels.length; i++) {
        
        rd.label[i] = this.text(x + horspace, y + newvert - 1, labels[i]).attr({"text-anchor": "start", "font-size": fontsize+"px"});
        
        rd.circle[i] = this.circle(x, y + newvert, size).attr({fill: "#eeeeee", "stroke": "#a0a0a0", "stroke-width": 1.2});
        
        rd.cover[i] = this.circle(x, y + newvert, size + 2).attr({fill: "#eeeeee", stroke: "none", "fill-opacity": 0, "cursor": "pointer"});
        rd.cover[i].i = i;
        rd.cover[i].click(function() {
            rd.fill.show();
            rd.fill.transform("t0," + (this.getBBox().y - y + size + 2));
            rd.whichChecked = this.i;
        });
        
        if (Array.isArray(vertspace)) {
            newvert = vertspace[i];
        }
        else {
            newvert = (i + 1)*vertspace;
        }
    }
    
    
    rd.fill.push(this.circle(x, y, size - 0.5).attr({fill: "#97bd6c", stroke: "none"}));
    rd.fill.push(this.circle(x, y, size - 4.5).attr({fill: "#000000", stroke: "none"}));
    
    
    if (rd.whichChecked < 0) {
        rd.fill.hide();
    }
    else {
        rd.fill.transform("t0," + (rd.circle[whichChecked].getBBox().y - y + size));
    }
    
    rd.moveTo = function(x) {
        rd.fill.show();
        rd.whichChecked = x;
        rd.fill.transform("t0," + (rd.circle[x].getBBox().y - y + size));
    }
    
    rd.hideIt = function() {
        for (var i = 0; i < rd.cover.length; i++) {
            rd.cover[i].hide();
            rd.circle[i].hide();
            rd.label[i].hide();
        }
        rd.fill.hide();
    }
    
    rd.showIt = function() {
        for (var i = 0; i < rd.cover.length; i++) {
            rd.cover[i].show();
            rd.circle[i].show();
            rd.label[i].show();
        }
        
        if (rd.whichChecked < 0) {
            rd.fill.hide();
        }
        else {
            rd.fill.show();
        }
    }
    
    return(rd);
    
}





function isNumeric(n) {
    return !/^(NaN|-?Infinity)$/.test(+n);
}


function copyObject(obj) {
    
    var cols = getKeys(obj);
    var temp = {};
    
    for (var i = 0; i < cols.length; i++) {
        temp[cols[i]] = obj[cols[i]];
    }
    
    return(temp);
}


function copyArray(obj, exclude) {
    
    if (exclude == void 0) {
        exclude = -1;
    }
    
    var temp = new Array(obj.length);
    var idx = 0;
    
    for (var i = 0; i < obj.length; i++) {
        if (i != exclude) {
            temp[idx] = obj[i];
        }
        idx += 1;
    }
    return(temp);
}



function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}



function getKeys(obj) {
    var keys = new Array(obj.length);
    var keycount = 0;
    for (var key in obj) {
        keys[keycount] = key;
        keycount += 1;
    }
    return(keys)
}


function getTrueKeys(obj) {
    var trueKeys = new Array();
    for (var key in obj) {
        if (obj[key]) {
            trueKeys.push(key);
        }
    }
    
    if (trueKeys.length == 0) {
        return(Array());
    }
    else {
        return(trueKeys);
    }
}



function changeCol(obj, oldname, newname) {
    var temp = new Array();
    
    for (var key1 in obj) {
        
        temp[key1] = new Array();
        
        for (var key2 in obj[key1]) {
            
            temp[key1][key2] = new Array();
            
            var oldkeys = getKeys(obj[key1][key2]);
            
            for (var i = 0; i < oldkeys.length; i++) {
                temp[key1][key2][(oldkeys[i] == oldname)?(newname):(oldkeys[i])] = obj[key1][key2][oldkeys[i]];
            }
        }
    }
    
    return(temp);
}





/* --------------------------------------------------------------------- */




function sat(obj, options) {
    
    if (options == void 0) {
        options = {};
    }
    
    if (options.size == void 0) {
        options.size = 14;
    }
    
    if (options.anchor == void 0) {
        options.anchor = "start";
    }
    
    // create a copy of the options
    var optkeys = getKeys(options);
    var options2 = new Array();
    for (var i = 0; i < optkeys.length; i++) {
        options2[optkeys[i]] = options[optkeys[i]];
    }
            
    
    if (Array.isArray(obj)) {
        var keys = getKeys(obj);
         
        
        for (var i = 0; i < keys.length; i++) {
            if (optkeys.indexOf("clip") >= 0) {
                if (typeof(options.clip) != "string") {
                    options2.clip = options.clip[keys[i]];
                }
            }
            sat(obj[keys[i]], options2);
        }
    }
    else {
        
        if (obj.type == "text") {
            var BBox, clipattr;
            
            if (options.clip == void 0) {
                obj.attr({"text-anchor": options.anchor, "font-size": (options.size + "px")});
                if (options["font-weight"] !== undefined) {
                    obj.attr({"font-weight": options["font-weight"]});
                }
            }
            else {
                
                if (typeof(options.clip) == "string") {
                    clipattr = options.clip;
                }
                else {
                    BBox = options.clip.getBBox();
                    clipattr = BBox.x + "," + BBox.y + "," + (BBox.width - 3) + "," + BBox.height;
                }
                
                
                obj.attr({"text-anchor": options.anchor, "font-size": (options.size + "px"), "clip-rect": clipattr});
            }
        }
        else {
            obj.attr({stroke: '#a0a0a0', 'stroke-width': ((optkeys.indexOf("sw") < 0)?1:options.sw), fill: "#ffffff", "fill-opacity": 0});
        }
    }
    
    return(obj);
}




/* --------------------------------------------------------------------- */




function setAttrCover(obj) {
    
    if (Array.isArray(obj)) {
        var keys = getKeys(obj);
        
        for (var i = 0; i < keys.length; i++) {
            setAttrCover(obj[keys[i]]);
        }
        
    }
    else {
        obj.attr({stroke: '#d0d0d0', 'stroke-width': 1, fill: "#ffffff", "fill-opacity": 0})
    }
    
    return(obj);
    
}




function round(x, y) {
    y = Math.pow(10, y);
    return(Math.round(x*y)/y);
}




function all(obj, rule, value) {
    if (value === void 0) {
        value = "";
    }
    var check = true;
    if (Array.isArray(obj)) {
        var keys = getKeys(obj);
        
        for (var i = 0; i < obj.length; i++) {
            if (Array.isArray(value)) {
                var check2 = false;
                for (var j = 0; j < value.length; j++) {
                    check2 = check2 || eval("obj[keys[i]]" + rule + value[j]);
                }
                check = check && check2;
            }
            else {
                check = check && eval("obj[keys[i]]" + rule + value);
            }
        }
    }
    else {
        if (Array.isArray(value)) {
            var check = false;
            for (var j = 0; j < value.length; j++) {
                check = check || eval("obj" + rule + value[j]);
            }
        }
        else {
            check = eval("obj" + rule, value);
        }
    }
    
    return(check);
}



function any(obj, rule, value) {
    if (value === void 0) {
        value = "";
    }
    var check = false;
    
    if (Array.isArray(obj)) {
        var keys = getKeys(obj);
        for (var i = 0; i < obj.length; i++) {
            if (Array.isArray(value)) {
                for (var j = 0; j < value.length; j++) {
                    check = check || eval("obj[keys[i]]" + rule + value[j]);
                }
            }
            else {
                check = check || eval("obj[keys[i]]" + rule + value);
            }
        }
    }
    else {
        if (Array.isArray(value)) {
            for (var j = 0; j < value.length; j++) {
                check = check || eval("obj" + rule + value[j]);
            }
        }
        else {
            check = eval("obj" + rule + value);
        }
    }
    
    return(check);
}



function rep(rule, times) {
    var result = new Array(times);
    for (var i = 0; i < times; i++) {
        result[i] = rule;
    }
    return(result);
}




function makeRules(oldv, newv) {
    
    var rule = new Array();
    
    if (oldv.length > 0) {
        rule = new Array(oldv.length);
        
        for (var i = 0; i < oldv.length; i++) {
            rule[i] = oldv[i] + "=" + newv[i];
        }
        
    }
    
    return(rule)
}



function getUniqueNewv(obj) {
    var uniques = new Array();
    var present;
    for (var i = 0; i < obj.length; i++) {
        
        if (uniques.indexOf(obj[i]) < 0) {
            uniques.push(obj[i]);
        }
        
    }
    
    return(uniques);
    
}



function eraseRecodeValues(paper) {
    paper.oldv.texts.VALUE.attr({"text": ""});
    paper.oldv.texts.range.FROM.attr({"text": ""});
    paper.oldv.texts.range.TO.attr({"text": ""});
    paper.oldv.texts.LOWESTTO.attr({"text": ""});
    paper.oldv.texts.TOHIGHEST.attr({"text": ""});
    paper.newv.texts.VALUE.attr({"text": ""});
}




/* --------------------------------------------------------------------- */




function checkRecodeSelections(colclicks, paper) {
    var cols = getTrueKeys(colclicks.recode.rules);
    eraseRecodeValues(paper);
    
    if (cols.length == 1) {
        var lr = cols[0].split("=");
        var lhs = lr[0].split(":");
        var rhs = lr[1];
        var idx = 0; // assume VALUE
        
        if (lhs.length > 1) {
            
            if (lhs[0] == "lo") {
                idx = 2;
                paper.oldv.texts.LOWESTTO.attr({"text": lhs[1]});
                paper.rules.oldv = lhs[1];
            }
            else if (lhs[1] == "hi") {
                idx = 3;
                paper.oldv.texts.TOHIGHEST.attr({"text": lhs[0]});
                paper.rules.oldv = lhs[0];
            }
            else {
                idx = 1;
                paper.oldv.texts.range.FROM.attr({"text": lhs[0]});
                paper.oldv.texts.range.TO.attr({"text": lhs[1]});
                paper.rules.oldv = [lhs[0], lhs[1]];
            }
        }
        else {
            if (lhs[0] == "missing") {
                idx = 4;
            }
            else if (lhs[0] == "else") {
                idx = 5;
            }
        }
        
        if (idx == 0) { 
            paper.oldv.texts.VALUE.attr({"text": lhs[0]});
            paper.rules.oldv = lhs[0];
        }
        
        if (rhs != "missing" && rhs != "copy") {
            paper.newv.texts.VALUE.attr({"text": rhs});
            paper.newradio.moveTo(0);
            paper.rules.newv = rhs;
        }
        else {
            if (rhs == "missing") {
                paper.newradio.moveTo(1);
            }
            else {
                paper.newradio.moveTo(2);
            }
        }
        
        paper.oldradio.moveTo(idx);
        
        
    }
}




/* --------------------------------------------------------------------- */




function deleteRule(colclicks, rule) {
    var keys = getKeys(colclicks.recode.rules);
    var temp = new Array();
    
    for (i = 0; i < keys.length; i++) {
        if (keys[i] != rule) {
            temp[keys[i]] = colclicks.recode.rules[keys[i]];
        }
    }
    
    colclicks.recode.rules = temp;
}




function changeRule(colclicks, selected, replacement) {
    var keys = getKeys(colclicks.recode.rules);
    var temp = new Array();
    
    for (i = 0; i < keys.length; i++) {
        if (keys[i] == selected) {
            temp[replacement] = false;
        }
        else {
            temp[keys[i]] = false;
        }
    }
    
    colclicks.recode.rules = temp;
}


function unselect(colclicks, dialog, identifier) {
    if (colclicks[dialog][identifier] != void 0) {
        var keys = getKeys(colclicks[dialog][identifier]);
        for (i = 0; i < keys.length; i++) {
            colclicks[dialog][identifier][keys[i]] = false;
        }
    }
}




/* --------------------------------------------------------------------- */




function scaleplot(paper) {
    var xyplotdata = paper.xyplotdata;
    var scale = paper.scale;
    var sx = paper.sx;
    var sy = paper.sy;
    var dim = paper.dim;
    var offset = paper.offset;
    var rdim = paper.rdim;
    var xcoord, ycoord;
    var randomjitter = paper.randomjitter;
    
    
    if (paper.total != void 0) {
        paper.total.remove();
        paper.mdlines.remove();
        paper.afv.remove();
        paper.ticks.remove();
        paper.pointsset.remove();
    }
    
    paper.total = paper.set();
    paper.afv = paper.set(); 
    paper.ticks = paper.set();
    paper.mdlines = paper.set(); 
    paper.pointsset = paper.set();
    paper.points = new Array();
    
    paper.total.push(paper.rect(sx, sy, scale*dim, scale*dim));
    paper.total.push(paper.path("M" + sx + "," + (sy + scale*dim) + " L" + (sx + scale*dim) + "," + sy).attr({"stroke": "#a0a0a0"}));
    
    paper.mdlines.push(paper.path("M" + sx + "," + (sy + scale*dim/2) +  " L" + (sx + scale*dim) + "," + (sy + scale*dim/2)).attr({"stroke-dasharray": "--"}));
    paper.mdlines.push(paper.path("M" + (sx + scale*dim/2) + "," + sy +  " L" + (sx + scale*dim/2) + "," + (sy + scale*dim)).attr({"stroke-dasharray": "--"}));
    paper.mdlines.attr({"stroke": "#a0a0a0"});
    
    for (var i = 0; i < 11; i++) {
        
        var vertick = 
        paper.ticks.push(paper.path("M" + (sx + scale*(offset + i*rdim/10)) + "," + (sy + scale*dim) + " L" + (sx + scale*(offset + i*rdim/10)) + "," + (sy + scale*dim + 7)));
        paper.ticks.push(paper.path("M" + (sx - 7) + "," + (sy + scale*(offset + i*rdim/10)) + " L" + sx + "," + (sy + scale*(offset + i*rdim/10)) ) );
        
        paper.afv.push(sat(paper.text(sx + scale*(offset + i*rdim/10), sy + scale*dim + 15, i/10), {"size": 12, "anchor": "middle"}));
        paper.afv.push(sat(paper.text(sx - 10, sy + scale*(offset + i*rdim/10), (10 - i)/10), {"size": 12, "anchor": "end"}));
        
        if (i == 5) {
            paper.afv.push(sat(paper.text(sx + scale*(offset + i*rdim/10), sy + scale*dim + 34, paper.x), {"size": 14, "anchor": "middle", "font-weight": "bold"}));
            var temp = sat(paper.text(sx - 38, sy + scale*(offset + i*rdim/10), paper.y), {"size": 14, "anchor": "end", "font-weight": "bold"});
            var BBox = temp.getBBox();
            temp.transform("t" + (BBox.width/2) + ",0r-90");
            paper.afv.push(temp);
        }
    
    }
    
    var point, txt, txtfundal, totalength;
    
    var hoverIn = function() {
        if (this.label.attr("text") != "" & !paper.labels.isChecked) {
            this.label[1].attr({"fill-opacity": 0.4});
            this.label.show();
            
        }
    }
    
    
    var hoverOut = function() {
        if (this.label.attr("text") != "" & !paper.labels.isChecked) {
            this.label[1].attr({"fill-opacity": 0});
            this.label.hide();
        }
    }
    
    
    if (xyplotdata.length > 0) { // plot the points
        for (var i = 0; i < xyplotdata[0].length; i++) {
            xcoord = sx + scale*(offset + rdim*((paper.negx.isChecked)?(1 - xyplotdata[1][i]):(xyplotdata[1][i]))) + ((getKeys(randomjitter).length > 0)?(randomjitter.x[i]):0);
            ycoord = sy + scale*(offset + rdim*((paper.negy.isChecked)?(xyplotdata[2][i]):(1 - xyplotdata[2][i]))) + ((getKeys(randomjitter).length > 0)?(randomjitter.y[i]):0);
            paper.points[i] = paper.circle(xcoord, ycoord, 4);
            paper.points[i].hover(hoverIn, hoverOut, point, point);
            
            paper.pointsset.push(paper.points[i]);
            
        }
        
        if (paper.pof.isChecked) {
            if (paper.sufnec.whichChecked == 0) {
                paper.incl.attr({"text": "Inclusion: " + xyplotdata[3][paper.index][0]});
                paper.cov.attr({"text": "Coverage: " + xyplotdata[3][paper.index][1]});
                paper.PRI.attr({"text": "PRI: " + xyplotdata[3][paper.index][2]});
            }
            else {
                paper.incl.attr({"text": "Inclusion: " + xyplotdata[4][paper.index][0]});              
                paper.cov.attr({"text": "Coverage: " + xyplotdata[4][paper.index][1]});
                paper.PRI.attr({"text": "PRI: " + xyplotdata[4][paper.index][2]});
                paper.ron.attr({"text": "Relevance: " + xyplotdata[4][paper.index][3]});
            }
        }
        
        paper.pointsset.attr({fill: "#707070", "fill-opacity": paper.fill.isChecked?1:0});
    }
    
}



/* --------------------------------------------------------------------- */



function createLabels(paper) {
    var xyplotdata = paper.xyplotdata;
    paper.labelsset.remove();
    paper.labelsset = paper.set();
    paper.labelsArray = new Array();
    
    var scale = paper.scale;
    var sx = paper.sx;
    var sy = paper.sy;
    var dim = paper.dim;
    var offset = paper.offset;
    var rdim = paper.rdim;
    var txt, txtfundal, outer, BBox, coords, x, y, r, twidth;
    
    
    if (xyplotdata.length > 0) { // plot the points
        for (var i = 0; i < xyplotdata[0].length; i++) {
            
            twidth = getTextWidth(xyplotdata[0][i])
            
            x = paper.points[i].attr("cx");
            y = paper.points[i].attr("cy");
            r = paper.points[i].attr("r");
            
            outer = paper.circle(x, y, r + twidth + 2*5).attr({"fill": "none", "stroke": "none"});
            
            coords = paper.points[i].getPointAtLength(paper.points[i].getTotalLength()*(90 - paper.labelRotation)/360);
            txtfundal = paper.rect(coords.x, coords.y - 8, twidth + 10, 16);
            txtfundal.attr({fill: "#c9c9c9", "fill-opacity": 0, stroke: "none"});
            txt = sat(paper.text(coords.x + 2.5, coords.y, xyplotdata[0][i]));
            txt.attr({"font-weight": "bold", "fill-opacity": 0.7});
            
            tempset = paper.set(paper.points[i], txt, txtfundal);
            BBox = tempset.getBBox();
            if (BBox.x + BBox.width > sx + scale*rdim) {
                txt.remove();
                txtfundal.remove();
                coords = outer.getPointAtLength(outer.getTotalLength()*(270 - paper.labelRotation)/360);
                txtfundal = paper.rect(coords.x, coords.y - 8, twidth + 10, 16);
                txtfundal.attr({fill: "#c9c9c9", "fill-opacity": 0, stroke: "none"});
                txt = sat(paper.text(coords.x + 2.5, coords.y, xyplotdata[0][i]));
                txt.attr({"font-weight": "bold", "fill-opacity": 0.7});
            }
            
            tempset = paper.set(paper.points[i], txt, txtfundal);
            
            paper.points[i].label = paper.set();
            paper.points[i].label.push(txt, txtfundal);
            
            paper.points[i].label.transform("r-" + paper.labelRotation + "," + coords.x + "," + coords.y);
            
            paper.labelsset.push(paper.points[i].label);
        }
    }
    
    
    if (paper.labels.isChecked) {
        paper.labelsset.show();
    }
    else {
        paper.labelsset.hide();
    }
    
    
}




/* --------------------------------------------------------------------- */




function setPath(paper, wd) {
    paper.clear();
    var wds = wd.split("/");
    var x = 1;
    var dirwidth = 0;
    var direct;
    
    var allobjs = paper.set();
    
    for (i = 0; i < wds.length; i++) {
        if (wds[0] == "") {
            wds[0] = "root";
        }
        
        if (wds[i] != "") {
            dirwidth = getTextWidth(wds[i]);
            allobjs.push(sat(paper.text(x, 7, wds[i])));
            direct = paper.rect(x - 3, 0, dirwidth + 6, 18)
                .attr({stroke: "none", fill: "#fff", "fill-opacity": 0});
            direct.dir = wds[i];
            direct.dblclick(function() {
                paper.goToDir(this.dir)
            });
            allobjs.push(direct);
            
            x += dirwidth + 2;
            
            if (i < wds.length - 1*((wds[wds.length - 1] == "")?2:1)) {
                allobjs.push(sat(paper.text(x + 3 , 7, ">")));
                x += 15;
            }
        }
    }
    
    
    var lastX, groupX, groupWidth;
    
    function dragStartLarge(group) {
        return function() {
            lastX = 0;
            var BBox = group.getBBox();
            groupX = BBox.x;
            groupWidth = BBox.width;
        }
    };
    
    
    function dragMoveLarge(group) {
        
        return function(dx, dy) {
            if (groupWidth > 400) {
                var newX = dx - lastX;
                
                if (groupX + dx > 0) {
                    newX = 0 - groupX - lastX;
                }
                
                if (groupX + dx < (400 - groupWidth)) {
                    newX = (400 - groupWidth) - (groupX + lastX);
                    lastX = (400 - groupWidth) - groupX;
                }
                else {
                    lastX += newX;
                }
                
                group.translate(newX, 0);
                
            }
            
        }
    };
    
    
    function dragStopLarge(group) {
        return function() {
            
        }
    };
    
    allobjs.drag(dragMoveLarge(allobjs), dragStartLarge(allobjs), dragStopLarge(allobjs));
    
    paper.setSize(x + 20, 20);
}



/* --------------------------------------------------------------------- */




function randomBetween(min, max) {
    return (min + Math.random()*(max - min + 1));
}



function reorder(obj, from, to) {
    var keys = getKeys(obj);
    var values = new Array(keys.length);
    for (var i = 0; i < keys.length; i++) {
        values[i] = obj[keys[i]];
    }
    
    keys.splice(to, 0, keys.splice(from, 1)[0]);
    values.splice(to, 0, values.splice(from, 1)[0]);
    
    var result = {};
    for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = values[i];
    }
    
    return(result);
}



// code from:
// http://stackoverflow.com/questions/840781/easiest-way-to-find-duplicate-values-in-a-javascript-array
function duplicates(arr) {
    var len = arr.length,
        out = [],
        counts = {};
    
    for (var i = 0; i < len; i++) {
        var item = arr[i];
        counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
    }
    
    for (var item in counts) {
        if (counts[item] > 1) {
            out[out.length] = item*1;
        }
    }
    
    return out;
}



// code from: http://www.alexandre-gomes.com/?p=115
function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";
    
    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);
    
    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;
    
    document.body.removeChild (outer);
    
    return (w1 - w2);
};




function scaleShape(path, scale) {
    var parsed = Raphael.parsePathString(path);
    for (var j = 0; j < parsed.length; j++) {
        for (k = 1; k < parsed[j].length; k++) {
            parsed[j][k] = parsed[j][k]*scale;
        }
    }
    return(parsed.toString());
}


function getShape(x, venn, scale) {
    
    bigpath = "";
    
    
    for (var b = 0; b < x.length; b++) {
        var path = "M";
        var stb, endb, end;
        var checkb = rep(false, x[b].length);
        
        var counter = 0;
        
        while(counter < 1000) { //any(checkb, "== false")
            for (var i = 0; i < checkb.length; i++) {
                if (!checkb[i]) {
                    var y = venn[x[b][i]];
                    
                    if (i == 0) {
                        for (var j = 0; j < y.length/2; j++) {
                            path += ((j == 1)?" C":"") + " " + round(y[2*j]*scale, 3) + "," + round(y[2*j + 1]*scale, 3);
                        }
                        checkb[i] = true;
                        end = y[y.length - 2] + " " + y[y.length - 1];
                    }
                    else {
                        stb = y[0] + " " + y[1];
                        endb = y[y.length - 2] + " " + y[y.length - 1]
                        
                        if (end == stb) {
                            //path += " C";
                            for (var j = 1; j < y.length/2; j++) {
                                path += " " + round(y[2*j]*scale, 3) + "," + round(y[2*j + 1]*scale, 3);
                            }
                            checkb[i] = true;
                            end = endb;
                        }
                        else if (end == endb) {
                            //path += " C";
                            for (var j = y.length/2 - 2; j >= 0; j--) {
                                path += " " + round(y[2*j]*scale, 3) + "," + round(y[2*j + 1]*scale, 3);
                            }
                            checkb[i] = true;
                            end = stb;
                        }
                    }
                }
            }
            
            if (all(checkb, "== true")) {
                counter = 1001;
            }
            counter += 1
        }
        
        
        bigpath += " " + path + " z";
    }
    return(bigpath);
}





function customShape(rule, venn, scale, id) {
    
    var rowns = new Array();
    rule = rule.split("");
    var idis, i, j, k;
    var check = rep(true, rule.length);
    var keys = getKeys(id);
    
    for (i = 0; i < keys.length; i++) {
        keys[i] = keys[i]*1;
        idis = id[keys[i]].split("");
        
        for (j = 0; j < rule.length; j++) {
            if (rule[j] != "-") {
                check[j] = any(idis, "==", j + 1);
                if (rule[j] == "0") {
                    check[j] = !check[j];
                }
            }
        }
        
        if (all(check, "== true")) {
            rowns[rowns.length] = i;
        }
    }
    
    var ids = new Array();
    for (i = 0; i < rowns.length; i++) {
        ids[i] = id[rowns[i]];
    }
    
    
    var inverted = any(rowns, "==", 0);
    
    if (rowns.length == 1 && rowns[0] == 0) {
        rowns = $(keys).not(rowns).get();
    }
    
    
    checkZone = function(from, rowns, checkz, venn) {
        var fromz = venn[1][from];
        var toz = new Array();
        
        for (var i = 0; i < rowns.length; i++) {
            if (!checkz[i]) {
                if (any(fromz, "==", venn[1][rowns[i]])) {
                    checkz[i] = true;
                    toz[toz.length] = rowns[i];
                }
            }
        }
        
        if (toz.length > 0) {
            for (var j = 0; j < toz.length; j++) {
                var checkz2 = checkZone(toz[j], rowns, checkz, venn);
                for (var i = 0; i < checkz.length; i++) {
                    checkz[i] = checkz[i] || checkz2[i];
                }
            }
        }
        
        return(checkz)
    }
    
    var result = new Array();
    
    if (rowns.length > 1) {
        var checkz = rep(false, rowns.length);
        checkz[0] = true;
        
        while(any(checkz, "== false")) {
            
            checkz = checkZone(rowns[0], rowns, checkz, venn);
            var temp1 = new Array();
            var temp2 = new Array();
            var checkz2 = new Array();
            for (i = 0; i < rowns.length; i++) {
                if (checkz[i]) {
                    temp1[temp1.length] = rowns[i];
                }
                else {
                    temp2[temp2.length] = rowns[i];
                    checkz2[checkz2.length] = false;
                }
            }
            
            
            result[result.length] = temp1;
            if (checkz2.length > 0) {
                rowns = copyArray(temp2);
                checkz = copyArray(checkz2);
                checkz[0] = true;
            }
        }
        
    }
    else {
        result[0] = [rowns];
    }
    
    for (var i = 0; i < result.length; i++) {
        var temp = venn[1][result[i][0]];
        
        if (result[i].length > 1) {
            for (var j = 1; j < result[i].length; j++) {
                temp = temp.concat(venn[1][result[i][j]]);
            }
        }
        
        result[i] = $(temp).not(duplicates(temp)).get();
        
    }
    
    return([getShape(result, venn[0], scale), inverted]);
    
}



function parseText(text, conditions) {
    
    text = text.replace("(", "");
    text = text.replace(")", "");
    text = text.replace(/\s/g, "");
    splitchar = "*";
    var parsedPlus = text.split("+");
    
    
    var largecheck = rep(false, parsedPlus.length);
    
    for (var i = 0; i < parsedPlus.length; i++) {
        var parsedStar = parsedPlus[i].split(splitchar);
        var upper = new Array(parsedStar.length);
        var lower = new Array(parsedStar.length);
        
        for (var j = 0; j < parsedStar.length; j++) {
            if (parsedStar[j][0] == "~") {
                parsedStar[j] = parsedStar[j].substring(1, parsedStar[j].length);
            }
            upper[j] = parsedStar[j].toUpperCase();
            lower[j] = parsedStar[j].toLowerCase();
            
            if (parsedStar[j] != upper[j] && parsedStar[j] != lower[j]) {
                return("error");
            }
        }
        
        
        var check = rep(false, parsedStar.length);
        
        for (var j = 0; j < parsedStar.length; j++) {
            check[j] = conditions.indexOf(upper[j]) < 0;
        }
        
        largecheck[i] = any(check, " == true")
    }
    
    
    if (any(largecheck, " == true")) {
        
        splitchar = "";
        var largecheck = rep(false, parsedPlus.length);
        for (var i = 0; i < parsedPlus.length; i++) {
            var parsedStar = parsedPlus[i].split(splitchar);
            var upper = new Array(parsedStar.length);
            for (var j = 0; j < parsedStar.length; j++) {
                if (parsedStar[j][0] == "~") {
                    parsedStar[j] = parsedStar[j].substring(1, parsedStar[j].length);
                }
                upper[j] = parsedStar[j].toUpperCase();
            }
            var check = rep(false, parsedStar.length);
            for (var j = 0; j < parsedStar.length; j++) {
                check[j] = conditions.indexOf(upper[j]) < 0;
            }
            largecheck[i] = any(check, " == true")
        }
        
        if (any(largecheck, " == true")) {
            return("error");
        }
        
    }
    
    
    finalResult = {};
    
    for (var i = 0; i < parsedPlus.length; i++) {
        var parsedStar = parsedPlus[i].split(splitchar);
        var upper = new Array(parsedStar.length);
        
        for (var j = 0; j < parsedStar.length; j++) {
            if (parsedStar[j][0] == "~") {
                parsedStar[j] = parsedStar[j].substring(1, parsedStar[j].length).toLowerCase();
            }
            upper[j] = parsedStar[j].toUpperCase();
        }
        
        var rule = "";
        for (var j = 0; j < conditions.length; j++) {
            var index = upper.indexOf(conditions[j]);
            rule += (index >= 0)?((parsedStar[index] == upper[index])?1:0):"-";
        }
        
        finalResult[parsedPlus[i]] = rule;
    }
    
    return(finalResult);
}






