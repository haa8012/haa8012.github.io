'use strict';
(function() {
  let setParams = ['ringSize', 'cornerRadius', 'gap', 'padding'];
  let cols = [];
  let backColor = 'white';

  function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ('0' + parseInt(x).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  $(document).ready(function() {
    const errMsg = document.getElementById('errMsg');
    const showErr = err => {
      errMsg.innerHTML = 'Oops! Something went wrong! ' + err.toString();
    };

    tableau.extensions
      .initializeDialogAsync()
      .then(function(openPayload) {
        let {
          ringSize,
          cornerRadius,
          gap,
          padding,
          sheetName,
          colors,
          backClr
        } = tableau.extensions.settings.getAll();

        const wss = tableau.extensions.dashboardContent.dashboard.worksheets;
        let ops = '';
        wss.forEach(d => {
          ops += `<option value =${d.name}>${d.name}</option>`;
        });

        let sel = document.getElementById('sheets');
        sel.innerHTML = ops;
        if (ringSize) {
          $('#ringSize').val(ringSize);
          $('#cornerRadius').val(cornerRadius);
          $('#gap').val(gap);
          $('#padding').val(padding);
          $('select#sheets option').each(function() {
            if (
              $(this)
                .text()
                .toLowerCase() == sheetName.toLowerCase()
            ) {
              $(this).prop('selected', 'selected');
              return;
            }
          });

          let clrs = [];
          colors.split(',').forEach((e, i) => {
            clrs[i] = e;
          });
          creatPallete(clrs);
          setBackground(backClr);
        } else {
          creatPallete(d3.schemeCategory10);
          setBackground(backColor);
        }

        $('#closeButton').click(closeDialog);
      })
      .catch(err => alert(err));
  });

  function closeDialog() {
    setParams.forEach(i => {
      tableau.extensions.settings.set(i, $('#' + i).val());
    });
    tableau.extensions.settings.set(
      'sheetName',
      $('#sheets option:selected').text()
    );

    tableau.extensions.settings.set('colors', cols.join(','));
    alert(backColor);
    tableau.extensions.settings.set('backClr', backColor);

    tableau.extensions.settings
      .saveAsync()
      .then(newSavedSettings => {
        tableau.extensions.ui.closeDialog('');
      })
      .catch(showErr);
  }

  function setBackground(clr) {
    // document.getElementById('background').style.backgroundColor = color;
    // $('#background').css('background-color', color);
    const backPicker = Pickr.create({
      el: '.swash-back',
      theme: 'nano',
      default: clr, //document.querySelector('.swash-back').style.backgroundColor,
      useAsButton: false,
      padding: 5,
      defaultRepresentation: 'HEX',
      // swatches: null,
      // silent: false,
      components: {
        preview: true,
        hue: true,
        interaction: { input: true, save: true }
      }
    });

    backPicker.on('save', (color, instance) => {
      backColor = color.toHEXA();

      instance.hide();
    });
  }

  function creatPallete(colorList) {
    let cp = document.getElementById('colorPallets');
    let crs = colorList.toString().split(',');
    let p = '';
    crs.forEach((e, i) => {
      p += `<div class='swash' id='color' style='background: ${e}'
            onClick=createPicker(${i})
            ></div>`;
    });

    cp.innerHTML = p;

    function createPicker(sel, index) {
      cols.push(rgb2hex(document.querySelector(sel).style.backgroundColor));
      const pickr = Pickr.create({
        el: sel,
        theme: 'nano',
        default: document.querySelector(sel).style.backgroundColor,
        useAsButton: false,
        padding: 5,
        defaultRepresentation: 'HEX',
        swatches: null,
        silent: false,
        components: {
          preview: true,
          hue: true,
          interaction: { input: true, save: true }
        }
      });
      pickr.idx = index;

      pickr.on('save', (color, instance) => {
        cols[instance.idx] = color.toHEXA();
        // alert(instance.idx);
        instance.hide();
      });
    }

    crs.forEach((e, i) => {
      createPicker('.swash', i);
    });
  }
})();
