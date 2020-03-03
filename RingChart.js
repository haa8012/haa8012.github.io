'use strict';

(function() {
  const defaultIntervalInMin = '5';
  let activeDatasourceIdList = [];

  $(document).ready(function() {
    const errMsg = document.getElementById('errMsg');
    const showErr = err => {
      errMsg.innerHTML = 'Error while Initializing: ' + err.toString();
    };

    let width = document.querySelector('body').offsetWidth;
    let height = document.querySelector('body').offsetHeight;
    let min = Math.min(width, height);
    tableau.extensions
      .initializeAsync({ configure: configure })
      .then(function() {
        // This event allows for the parent extension and popup extension to keep their
        // settings in sync.  This event will be triggered any time a setting is
        // changed for this extension, in the parent or popup (i.e. when settings.saveAsync is called).

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
    // This uses the window.location.origin property to retrieve the scheme, hostname, and
    // port where the parent extension is currently running, so this string doesn't have
    // to be updated if the extension is deployed to a new location.
    const popupUrl = `${window.location.origin}/Samples/RingChart/RingChartDialog.html`;

    /**
     * This is the API call that actually displays the popup extension to the user.  The
     * popup is always a modal dialog.  The only required parameter is the URL of the popup,
     * which must be the same domain, port, and scheme as the parent extension.
     *
     * The developer can optionally control the initial size of the extension by passing in
     * an object with height and width properties.  The developer can also pass a string as the
     * 'initial' payload to the popup extension.  This payload is made available immediately to
     * the popup extension.  In this example, the value '5' is passed, which will serve as the
     * default interval of refresh.
     */

    let {
      ringSize,
      cornerRadius,
      gap,
      padding,
      sheetName,
      colors
    } = tableau.extensions.settings.getAll();

    tableau.extensions.ui
      .displayDialogAsync(popupUrl, '', {
        height: 450,
        width: 500
      })
      .then(closePayload => {})
      .catch(error => {
        // One expected error condition is when the popup is closed by the user (meaning the user
        // clicks the 'X' in the top right of the dialog).  This can be checked for like so:
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

    let width = document.querySelector('body').offsetWidth;
    let height = document.querySelector('body').offsetHeight;
    let min = Math.min(width, height);
    let counts = [];

    // Find a specific worksheet
    var worksheet = worksheets.find(function(sheet) {
      return sheet.name === settings.sheetName; //'Profit Cat'; //sheetName;
    });

    worksheet.getSummaryDataAsync().then(function(sumdata) {
      const worksheetData = sumdata.data.map(d => {
        return d.map(i => {
          return i.value;
        });
      }); //totalRowCount;

      const columns = sumdata.columns.map(d => {
        return d.fieldName;
      });

      counts.push(worksheetData);
      let vals = [];

      let data = sumdata.data.map((d, i) => {
        return d.map((i, idx) => {
          return idx == 1 ? vals.push(+i.value) : null;
        });
      });

      vals = vals.sort(function(a, b) {
        return b - a;
      });
      let cats = [];
      let catNames = sumdata.data.map((d, i) => {
        return d.map((i, idx) => {
          return idx == 0 ? cats.push(i.value) : null;
        });
      });

      let setColors = [];
      settings.colors.split(',').forEach((e, i) => {
        setColors[i] = e;
      });

      drawPie(
        '#ringChart',
        width - 50,
        width - 50,
        vals,
        cats,
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
