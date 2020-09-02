var step = false
var basis = false

var graphData, allValues, tmp
var colorArr = d3.scaleOrdinal(d3.schemeCategory10);
var color = (d, i) => {
    var radios = document.getElementsByName('coloryze')[0];
    var selected = radios.value;
    
    if(!selected || selected == 'None' ) return '#747474';
    var arr = []
    // console.log(selected)
    var opts = drowDropdowns[selected].dom.getElementsByClassName('select-option')
    for(var l = 0; l < opts.length; l++){
        arr.push(opts[l].innerText)
    }
    if(!d.data)  return '#747474';
    tmp = [arr, colorArr(arr.indexOf(d.data[selected])), arr.indexOf(d.data[selected]), d.data[selected]]//,d, selected, drowDropdowns[selected], d.data[selected]]
    // console.log(tmp)
    return colorArr(arr.indexOf(d.data[selected]))
}
var drowDots = (__data) => {
    var line1 = document.getElementsByClassName('line-1')[0];
    var line2 = document.getElementsByClassName('line-2')[0];
    line1.innerHtml = '';
    line2.innerHtml = '';
    __data.forEach(row => {
        if(row.data["In this situation you…-Did not get personally involved"]){
            var dotOnLine = document.createElement('i')
            dotOnLine.setAttribute('nar-id', row.data.NarrID)
            dotOnLine.setAttribute('class', 'dot-on-line')
            dotOnLine.setAttribute('style', 'left: ' + (+row.data["In this situation you…-Did not get personally involved"] * 4)+ 'px; border-color: ' + color(row))
            line1.appendChild(dotOnLine)
            // console.log(row.data["In this situation you…-Did not get personally involved"])
        }
        if(row.data["In this situation you…-Acted gradually"]){
            var dotOnLine = document.createElement('i')
            dotOnLine.setAttribute('style', 'left: ' + (+row.data["In this situation you…-Acted gradually"] * 4)+ 'px; border-color: ' + color(row))
            dotOnLine.setAttribute('class', 'dot-on-line')
            dotOnLine.setAttribute('nar-id', row.data.NarrID)
            line2.appendChild(dotOnLine)
            // console.log(row.data["In this situation you…-Did not get personally involved"])
        }
    })
}

var drow = (data_, linetype) => {
    // if(!data) return;
    drowDots(data_) 
    var data = data_
    graphData = data_
    d3.select("svg").remove();
    var width = window.innerWidth - 100;
    var height = 350//window.innerHeight / 2;
    document.getElementById('count').innerText = data_.length
   /* Scale */
    var xScale = d3.scaleTime()
        .domain([0, 9])
        .range([0, (width)]);

    var yScale = d3.scaleLinear()
        .domain([100, 0])
        .range([0, height]);
    
    
    
    
    /* Add SVG */
    var svg = d3.select("#chart").append("svg")
        .attr("width", (width)+"px")
        .attr("height", (height + 10)+"px")
        .attr('style', 'margin-left: ' + (step ? 0 : 5) + '%;')
        .append('g')
    
        // /* Add sieverts into SVG */
        
    var line = d3.line()
        .curve(step ? d3.curveStepBefore : basis ? d3.curveBasis : d3.curveLinear )
        .x((d, i) => xScale(i))
        .y((d, i) => yScale(d));
        
    
    
    let lines = svg.append('g').attr('class', 'liness');
    
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('path')
            .attr('class', 'line')
            .attr('stroke', (d, i) => color(d, i))
            .attr('d', d => line(d.lineData))
            .style('opacity', .7)
            .style('stroke-width', .7)

    
    let linesHov = svg.append('g').attr('class', 'lines-hov');
            
    linesHov.selectAll('.line-hov-group')
        .data(data).enter()
        // .append('g')
        // .attr('class', 'line-group')  
        .append('path')
        // .attr('class', 'line-hov')  
        .attr('d', d => line(d.lineData))
        .style('opacity', 0)
            .style('stroke-width', 6)
            .style('fill', "none")
            .style('stroke', (d, i) => color(i))
            .on("mouseover", (d) => hover(d))
            .on("mouseout", (d) => out(d))
            .on("click", (d) => show(d));
            
}

var show = (d) => {
    
    // alert(d.data.Experience)
    var msg = '';
    ["Title","Experience"]//,"FragmentID","NarrID","Are you related to/do you know either the victim or the perpetrator?","How is the victim related to the perpetrator?","What is the age category of the victim?","2.5 What is the gender of the perpetrator?","2.6 Where did this situation happen?","2.6 Other","2.8 Where did this situation happen?","3.1 Did you act/do something about this situation?","3.5 Have you contacted any services about this situation?","3.5 Other","4.1 The outcome of this situation for the victim was…","4.2 Situations like these…","5.1 If you were to witness a similar situation in the future you would…","6.5 Education","6.1 Gender","6.2 Age","6.6 Marital status","6.3 Ethnicity","6.3 Other","6.7 Monthly income","6.4 Attendance of religious services","6.8 Region of residence","6.11 Region originally from","6.11 Other","6.9 Residence","6.10 How long have you lived here for?"]
        .forEach(m => {
        msg += m + ': ' + d.data[m] + '\n'
    })
    alert(msg)
    // console.log(d)
}
     
var hover = (d) => {
    d3.selectAll('.line').filter(line => line.data.NarrID != d.data.NarrID)
                    .style('opacity', .01);
    d3.selectAll('.line').filter(line => line.data.NarrID == d.data.NarrID)
                    .style('stroke-width', 2);
    var dotsOnLine = document.getElementsByClassName('dot-on-line')
    for(var dotIndex; dotIndex < dotsOnLine.length; dotIndex++){
        if(dotsOnLine[dotIndex].getAttribute('nar-id') == d.data.NarrID){
            dotsOnLine[dotIndex].classList.remove('hide')
        } else {
            dotsOnLine[dotIndex].classList.add('hide')
        }
    }

    Object.keys(d.data).forEach(key => {
        if(drowDropdowns[key]){
            // console.log(key)
            opts = drowDropdowns[key].dom.getElementsByClassName('select-option')
            for(var optIndex = 0; optIndex < opts.length; optIndex++){
                if(opts[optIndex].innerHTML == d.data[key]){
                    opts[optIndex].classList.add('higlight')
                } else {
                    opts[optIndex].classList.remove('higlight')
                }
            }
        }
    })
                    
}
var out = (d) => {
    d3.selectAll(".line").style('opacity', .9).style('stroke-width', .7);
    opts = document.getElementsByClassName('select-option')
    for(var optIndex = 0; optIndex < opts.length; optIndex++){
        opts[optIndex].classList.remove('higlight')
    }
    var dotsOnLine = document.getElementsByClassName('dot-on-line')
    for(var dotIndex; dotIndex < dotsOnLine.length; dotIndex++){
        dotsOnLine[dotIndex].classList.remove('hide')
    }
}

const mapToChartData = row => ({ lineData: step ? 
    [+row['You did not act/do something because you…-Feared for your safety'],+row['You did not act/do something because you…-Feared for your safety'],+row['You did not act/do something because you…-Believed it was not your job/place'],+row['You did not act/do something because you…-Did not know how to help'],+row['You did something because you-Could rely on support of public services'],+row['You did something because you-Felt responsible for dealing with it'],+row['You did something because you-Knew what to do/how to help'],+row['You decided to act/not act the way you did because-You did not have a choice'],+row['You decided to act/not act the way you did because-To you it was the right thing to do'],+row['You decided to act/not act the way you did because-It was an appropriate/acceptable thing to do']] : 
    [+row['You did not act/do something because you…-Feared for your safety'],+row['You did not act/do something because you…-Believed it was not your job/place'],+row['You did not act/do something because you…-Did not know how to help'],+row['You did something because you-Could rely on support of public services'],+row['You did something because you-Felt responsible for dealing with it'],+row['You did something because you-Knew what to do/how to help'],+row['You decided to act/not act the way you did because-You did not have a choice'],+row['You decided to act/not act the way you did because-To you it was the right thing to do'],+row['You decided to act/not act the way you did because-It was an appropriate/acceptable thing to do']],
    data: row})

let globalData
d3.csv('./undp_ipv_ge_6Sept19-undp_ipv_ge_21Aug19.csv')
    .then(csv => {
        csv_nonum = []
        csv.forEach(row => {
            now_nonum = {}
            Object.keys(row).forEach(colname => {
                now_nonum[colname.replace(/^\d+\.\d+ /gi , '')] = row[colname] 
            })
            csv_nonum.push(now_nonum)
        }) 
        globalData = csv_nonum
        // globalData = csv
        buildDropdowns(csv_nonum)
        drow(csv_nonum.map(mapToChartData))
    })


const buildDropdowns = (data) => {
    const columns = [ 'Are you related to/do you know either the victim or the perpetrator?','How is the victim related to the perpetrator?','What is the age category of the victim?','What is the gender of the perpetrator?','Where did this situation happen?','Where did this situation happen?','Did you act/do something about this situation?','Have you contacted any services about this situation?','The outcome of this situation for the victim was…','Situations like these…','If you were to witness a similar situation in the future you would…','Education','Gender','Age','Marital status','Ethnicity','Monthly income','Attendance of religious services','Region of residence','Region originally from','Residence','How long have you lived here for?' ]
    options = {}
    columns.forEach(col => options[col] = [])
    data.forEach( row => {
        columns.forEach(col => {
            if(options[col].indexOf(row[col]) === -1) {
                options[col].push(row[col])
            }
        })
    })
    
    var colorizer = document.getElementsByName('coloryze')[0]
    columns.forEach(opt => {
        var option = document.createElement('option')    
        option.setAttribute("value", opt)
        option.innerHTML = opt
        colorizer.appendChild(option)
    })
    colorizer.addEventListener('change', () => {
        var sss =  document.getElementsByClassName('col-codes')[0]
        sss.innerHTML = ''
        var coloryzess = document.getElementsByName('coloryze')[0].value
        if(coloryzess && coloryzess != 'None' && drowDropdowns[coloryzess]){
            // var ppppt = 
            document.getElementsByClassName('col-codes')[0].classList.remove('col-codes')
            drowDropdowns[coloryzess].dom.classList.add('col-codes')// .getElementsByClassName('selected-option')
            // for(var i = 0; i < ppppt.length; i++){
            //     let li = document.createElement("li")
            //     li.innerText = ppppt[i].innerText
            //     sss.appendChild(li)
            // }
        }
        
        filter()
    })
    
    document.getElementsByName('line')[0].addEventListener('change', (e) => {
        step  = !1
        basis = !1
        if(e.target.value == "Step"){
            step  = !0
            basis = !1
        }
        if(e.target.value == "Basis"){
            step  = !1
            basis = !0
        }
        filter();
    })
    


    var sels = document.getElementsByClassName('select-title')
    for(var kk = 0; kk < sels.length; kk++){
        drowDropdowns[sels[kk].innerText] = { dom: sels[kk].parentNode, values: [] }
        var opts = sels[kk].parentNode.getElementsByClassName('select-option');
        for(var optIndex = 0; optIndex < opts.length; optIndex++){
            opts[optIndex].addEventListener('click', e => {
                var drpd = drowDropdowns[e.target.parentNode.getElementsByClassName('select-title')[0].innerText]
                if(drpd.values.indexOf(e.target.innerText) === -1){
                    drpd.values.push(e.target.innerText)
                    e.target.classList.add('option-selected')
                } else {
                    drpd.values.splice(drpd.values.indexOf(e.target.innerText), 1)
                    e.target.classList.remove('option-selected')
                }
                filter()
            })

        }
    }
    
}

// const drowDropdownDoms = {}
const drowDropdowns = {}

document.getElementById("clear").addEventListener('click', () => {
    var opts = document.getElementsByClassName('select-option');
    for(var optIndex = 0; optIndex < opts.length; optIndex++){
        opts[optIndex].classList.remove('option-selected')
    }
    Object.keys(drowDropdowns).forEach(dn => {
        drowDropdowns[dn].values = []; 
    })    
    filter();
})


const filter = () => {
    drow(Object.keys(drowDropdowns)
        .reduce((globalDataReduced,drowDropdownName) => 
            globalDataReduced.filter(row => drowDropdowns[drowDropdownName].values.length == 0 || drowDropdowns[drowDropdownName].values.indexOf(row[drowDropdownName]) !== -1)
        , globalData)
        .map(mapToChartData))
}