'use strict';

(function() {
  $(window).resize(function() {
    updateExtensionBasedOnSettings(tableau.extensions.settings.getAll());
  });

  $(document).ready(function() {
    const errMsg = document.getElementById('errMsg');
    const showErr = err => {
      errMsg.innerHTML = 'Error while Initializing: ' + err.toString();
    };

    tableau.extensions
      .initializeAsync({ configure: configure })
      .then(function() {
        if (tableau.extensions.settings.get('sheetName')) {
          updateExtensionBasedOnSettings(tableau.extensions.settings.getAll());
        }

        tableau.extensions.settings.addEventListener(
          tableau.TableauEventType.SettingsChanged,
          settingsEvent => {
            updateExtensionBasedOnSettings(settingsEvent.newSettings);
          }
        );
      });
  });

  function configure() {
    const popupUrl = `${window.location.origin}/RingChartDialog.html`;
    // const popupUrl = `${window.location.origin}/samples/RingChart/haa8012.github.io/RingChartDialog.html`;

    tableau.extensions.ui
      .displayDialogAsync(popupUrl, '', {
        height: 450,
        width: 500
      })
      .then(closePayload => {})
      .catch(error => {
        switch (error.errorCode) {
          case tableau.ErrorCodes.DialogClosedByUser:
            console.log('Dialog was closed by user');
            break;
          default:
            console.error(error.message);
        }
      });
  }

  function updateExtensionBasedOnSettings(settings) {
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

    let width = window.innerWidth; // document.querySelector('body').offsetWidth;
    let height = window.innerHeight; //document.querySelector('body').offsetHeight;
    let min = Math.min(width, height);
    // alert(min);
    // alert(`width: ${width}, Height: ${width}, Min: ${min}`);
    // Find a specific worksheet
    var worksheet = worksheets.find(function(sheet) {
      return sheet.name === settings.sheetName; //'Profit Cat'; //sheetName;
    });

    worksheet.getSummaryDataAsync().then(function(sumdata) {
      // const worksheetData = sumdata.data.map(d => {
      //   return d.map(i => {
      //     return i.value;
      //   });
      // }); //totalRowCount;

      let ringData = {};

      sumdata.data.forEach((d, i) => {
        ringData[d[(i, 0)].value] = +d[(i, 1)].value;
      });

      // vals = vals.sort(function(a, b) {
      //   return b - a;
      // });

      let setColors = [];
      settings.colors.split(',').forEach((e, i) => {
        setColors[i] = e;
      });
      drawPie(
        '#ringChart',
        width,
        height,
        Object.values(ringData),
        Object.keys(ringData),
        settings.backClr,
        settings.ringSize,
        settings.cornerRadius,
        settings.gap,
        settings.padding,
        setColors
      );

      let txt = document.getElementById('inactive');
      txt.innerHTML = '';
    });
  }
})();
