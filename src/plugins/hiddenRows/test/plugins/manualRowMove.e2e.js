describe('HiddenRows', () => {
  const id = 'testContainer';

  function extractDOMStructure(overlay) {
    const overlayBody = overlay.find('tbody')[0].cloneNode(true);

    Array.from(overlayBody.querySelectorAll('th')).forEach((TH) => {
      // Simplify header content
      TH.innerText = TH.querySelector('.rowHeader').innerText;
      TH.removeAttribute('style');
    });

    return `${overlayBody.outerHTML}`;
  }

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('manualRowMove', () => {
    it('should properly render hidden ranges after moving action (moving not hidden rows just before the hidden one)', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 2),
        rowHeaders: true,
        hiddenRows: {
          rows: [0],
          indicators: true
        },
        manualRowMove: true,
      });

      getPlugin('manualRowMove').moveRows([2, 3, 4], 0);
      render();

      expect(hot.getData()).toEqual([
        ['A3', 'B3'],
        ['A4', 'B4'],
        ['A5', 'B5'],
        ['A1', 'B1'], // Hidden row
        ['A2', 'B2'],
      ]);
      expect(hot.getRowHeight(3)).toBe(0);
      expect(getPlugin('hiddenRows').isHidden(3)).toBeTruthy();
      expect(extractDOMStructure(getMaster())).toMatchHTML(`
        <tbody>
          <tr>
            <th class="">1</th>
            <td class="">A3</td>
            <td class="">B3</td>
          </tr>
          <tr>
            <th class="">2</th>
            <td class="">A4</td>
            <td class="">B4</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_BEFORE_HIDDEN}">3</th>
            <td class="">A5</td>
            <td class="">B5</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_AFTER_HIDDEN}">5</th>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">A2</td>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">B2</td>
          </tr>
        </tbody>
        `);
    });

    it('should properly render hidden ranges after moving action (moving not hidden rows just after the hidden one)', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 2),
        rowHeaders: true,
        hiddenRows: {
          rows: [4],
          indicators: true
        },
        manualRowMove: true
      });

      getPlugin('manualRowMove').moveRows([0, 1, 2], 2);
      render();

      expect(hot.getData()).toEqual([
        ['A4', 'B4'],
        ['A5', 'B5'], // Hidden row
        ['A1', 'B1'],
        ['A2', 'B2'],
        ['A3', 'B3'],
      ]);
      expect(hot.getRowHeight(1)).toBe(0);
      expect(getPlugin('hiddenRows').isHidden(1)).toBeTruthy();
      expect(extractDOMStructure(getMaster())).toMatchHTML(`
        <tbody>
          <tr>
            <th class="${CSS_CLASS_BEFORE_HIDDEN}">1</th>
            <td class="">A4</td>
            <td class="">B4</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_AFTER_HIDDEN}">3</th>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">A1</td>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">B1</td>
          </tr>
          <tr>
            <th class="">4</th>
            <td class="">A2</td>
            <td class="">B2</td>
          </tr>
          <tr>
            <th class="">5</th>
            <td class="">A3</td>
            <td class="">B3</td>
          </tr>
        </tbody>
        `);
    });

    it('should properly render hidden ranges after moving action (moving only hidden row)', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 2),
        rowHeaders: true,
        hiddenRows: {
          rows: [4],
          indicators: true
        },
        manualRowMove: true
      });

      getPlugin('manualRowMove').moveRows([4], 1);
      render();

      expect(hot.getData()).toEqual([
        ['A1', 'B1'],
        ['A5', 'B5'], // Hidden row
        ['A2', 'B2'],
        ['A3', 'B3'],
        ['A4', 'B4'],
      ]);
      expect(hot.getRowHeight(1)).toBe(0);
      expect(getPlugin('hiddenRows').isHidden(1)).toBeTruthy();
      expect(extractDOMStructure(getMaster())).toMatchHTML(`
        <tbody>
          <tr>
            <th class="${CSS_CLASS_BEFORE_HIDDEN}">1</th>
            <td class="">A1</td>
            <td class="">B1</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_AFTER_HIDDEN}">3</th>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">A2</td>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">B2</td>
          </tr>
          <tr>
            <th class="">4</th>
            <td class="">A3</td>
            <td class="">B3</td>
          </tr>
          <tr>
            <th class="">5</th>
            <td class="">A4</td>
            <td class="">B4</td>
          </tr>
        </tbody>
        `);
    });

    it('should properly render hidden ranges after moving action (moving range of rows containing a hidden row)', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 2),
        rowHeaders: true,
        hiddenRows: {
          rows: [3],
          indicators: true
        },
        manualRowMove: true
      });

      getPlugin('manualRowMove').moveRows([2, 3, 4], 1);
      render();

      expect(hot.getData()).toEqual([
        ['A1', 'B1'],
        ['A3', 'B3'],
        ['A4', 'B4'], // Hidden row
        ['A5', 'B5'],
        ['A2', 'B2'],
      ]);
      expect(hot.getRowHeight(2)).toBe(0);
      expect(getPlugin('hiddenRows').isHidden(2)).toBeTruthy();
      expect(extractDOMStructure(getMaster())).toMatchHTML(`
        <tbody>
          <tr>
            <th class="">1</th>
            <td class="">A1</td>
            <td class="">B1</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_BEFORE_HIDDEN}">2</th>
            <td class="">A3</td>
            <td class="">B3</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_AFTER_HIDDEN}">4</th>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">A5</td>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">B5</td>
          </tr>
          <tr>
            <th class="">5</th>
            <td class="">A2</td>
            <td class="">B2</td>
          </tr>
        </tbody>
        `);
    });

    it('should properly render hidden ranges after moving action (shifts between hidden rows)', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 2),
        rowHeaders: true,
        hiddenRows: {
          rows: [1, 2, 3],
          indicators: true
        },
        manualRowMove: true
      });

      getPlugin('manualRowMove').moveRows([3, 1, 2], 1);
      render();

      expect(hot.getData()).toEqual([
        ['A1', 'B1'],
        ['A4', 'B4'], // Hidden row
        ['A2', 'B2'], // Hidden row
        ['A3', 'B3'], // Hidden row
        ['A5', 'B5'],
      ]);
      expect(hot.getRowHeight(1)).toBe(0);
      expect(hot.getRowHeight(2)).toBe(0);
      expect(hot.getRowHeight(3)).toBe(0);
      expect(getPlugin('hiddenRows').isHidden(1)).toBeTruthy();
      expect(getPlugin('hiddenRows').isHidden(2)).toBeTruthy();
      expect(getPlugin('hiddenRows').isHidden(3)).toBeTruthy();
      expect(extractDOMStructure(getMaster())).toMatchHTML(`
        <tbody>
          <tr>
            <th class="${CSS_CLASS_BEFORE_HIDDEN}">1</th>
            <td class="">A1</td>
            <td class="">B1</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_AFTER_HIDDEN}">5</th>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">A5</td>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">B5</td>
          </tr>
        </tbody>
        `);
    });

    it('should properly render hidden ranges after moving action (moving part of hidden rows)', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 2),
        rowHeaders: true,
        hiddenRows: {
          rows: [1, 3, 4],
          indicators: true
        },
        manualRowMove: true
      });

      getPlugin('manualRowMove').moveRows([3, 4], 0);
      render();

      expect(hot.getData()).toEqual([
        ['A4', 'B4'], // Hidden row
        ['A5', 'B5'], // Hidden row
        ['A1', 'B1'],
        ['A2', 'B2'], // Hidden row
        ['A3', 'B3'],
      ]);
      expect(hot.getRowHeight(0)).toBe(0);
      expect(hot.getRowHeight(1)).toBe(0);
      expect(hot.getRowHeight(3)).toBe(0);
      expect(getPlugin('hiddenRows').isHidden(0)).toBeTruthy();
      expect(getPlugin('hiddenRows').isHidden(1)).toBeTruthy();
      expect(getPlugin('hiddenRows').isHidden(3)).toBeTruthy();
      expect(extractDOMStructure(getMaster())).toMatchHTML(`
        <tbody>
          <tr>
            <th class="${CSS_CLASS_AFTER_HIDDEN} ${CSS_CLASS_BEFORE_HIDDEN}">3</th>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">A1</td>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">B1</td>
          </tr>
          <tr>
            <th class="${CSS_CLASS_AFTER_HIDDEN}">5</th>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">A3</td>
            <td class="${CSS_CLASS_AFTER_HIDDEN}">B3</td>
          </tr>
        </tbody>
        `);
    });

    describe('UI', () => {
      describe('backlight', () => {
        it('should get correct position and size while grabing the row placed after hidden rows', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [0, 1],
              indicators: true
            },
            manualRowMove: true,
          });

          const $headerTH = spec().$container.find('tbody tr:eq(2) th:eq(0)'); // header "5"

          $headerTH.simulate('mousedown');
          $headerTH.simulate('mouseup');
          $headerTH.simulate('mousedown'); // Triggers backlight

          const $backlight = spec().$container.find('.ht__manualRowMove--backlight');

          expect($backlight.offset().top).toBe($headerTH.offset().top);
          expect($backlight.height()).toBe(23);
        });

        it('should get correct position and size while grabing the multiple rows placed after hidden rows', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [0, 1],
              indicators: true
            },
            manualRowMove: true,
          });

          const $firstHeaderTH = spec().$container.find('tbody tr:eq(2) th:eq(0)');

          $firstHeaderTH
            .simulate('mousedown')
            ; // header "5"
          spec().$container.find('tbody tr:eq(3) th:eq(0)')
            .simulate('mouseover')
            ; // header "6"
          spec().$container.find('tbody tr:eq(4) th:eq(0)')
            .simulate('mouseover')
            .simulate('mouseup')
            .simulate('mousedown') // Triggers backlight
            ; // header "7"

          const $backlight = spec().$container.find('.ht__manualRowMove--backlight');

          expect($backlight.offset().top).toBe($firstHeaderTH.offset().top);
          expect($backlight.height()).toBe(69); // 23 * 3
        });

        it('should get correct position and size while grabing the row placed before hidden rows', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [8, 9],
              indicators: true
            },
            manualRowMove: true,
          });

          const $headerTH = spec().$container.find('tbody tr:eq(2) th:eq(0)'); // header "3"

          $headerTH.simulate('mousedown');
          $headerTH.simulate('mouseup');
          $headerTH.simulate('mousedown');

          const $backlight = spec().$container.find('.ht__manualRowMove--backlight');

          expect($backlight.offset().top).toBe($headerTH.offset().top);
          expect($backlight.height()).toBe(23);
        });

        it('should get correct position and size while grabing the multiple rows placed before hidden rows', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [8, 9],
              indicators: true
            },
            manualRowMove: true,
          });

          const $firstHeaderTH = spec().$container.find('tbody tr:eq(2) th:eq(0)');

          $firstHeaderTH
            .simulate('mousedown')
            ; // header "3"
          spec().$container.find('tbody tr:eq(3) th:eq(0)')
            .simulate('mouseover')
            ; // header "4"
          spec().$container.find('tbody tr:eq(4) th:eq(0)')
            .simulate('mouseover')
            .simulate('mouseup')
            .simulate('mousedown') // Triggers backlight
            ; // header "5"

          const $backlight = spec().$container.find('.ht__manualRowMove--backlight');

          expect($backlight.offset().top).toBe($firstHeaderTH.offset().top);
          expect($backlight.height()).toBe(69); // 23 * 3
        });
      });

      describe('guideline', () => {
        it('should get correct position while grabing the row placed after hidden rows (moving down)', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [0, 1],
              indicators: true
            },
            manualRowMove: true,
          });

          const $firstHeaderTH = spec().$container.find('tbody tr:eq(2) th:eq(0)');
          const $secondHeaderTH = spec().$container.find('tbody tr:eq(3) th:eq(0)');

          $firstHeaderTH
            .simulate('mousedown')
            .simulate('mouseup')
            .simulate('mousedown')
            ; // Header "5"
          $secondHeaderTH
            .simulate('mouseover')
            .simulate('mousemove', {
              clientY: $secondHeaderTH.offset().top,
            }); // Header "6"
            ;

          const $guideline = spec().$container.find('.ht__manualRowMove--guideline');

          expect($guideline.offset().top).toBe($secondHeaderTH.offset().top - 2);
        });

        it('should get correct position while grabing the row placed after hidden rows (moving up)', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [0, 1],
              indicators: true
            },
            manualRowMove: true,
          });

          const $firstHeaderTH = spec().$container.find('tbody tr:eq(2) th:eq(0)');
          const $secondHeaderTH = spec().$container.find('tbody tr:eq(3) th:eq(0)');

          $secondHeaderTH
            .simulate('mousedown')
            .simulate('mouseup')
            .simulate('mousedown')
            ; // Header "6"
          $firstHeaderTH
            .simulate('mouseover')
            .simulate('mousemove', {
              clientY: $firstHeaderTH.offset().top + $firstHeaderTH.height(),
            }); // Header "5"
            ;

          const $guideline = spec().$container.find('.ht__manualRowMove--guideline');

          expect($guideline.offset().top).toBe($firstHeaderTH.offset().top + $firstHeaderTH.height() - 1);
        });

        it('should get correct position while grabing the row placed before hidden rows (moving down)', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [8, 9],
              indicators: true
            },
            manualRowMove: true,
          });

          const $firstHeaderTH = spec().$container.find('tbody tr:eq(2) th:eq(0)');
          const $secondHeaderTH = spec().$container.find('tbody tr:eq(3) th:eq(0)');

          $firstHeaderTH
            .simulate('mousedown')
            .simulate('mouseup')
            .simulate('mousedown')
            ; // Header "3"
          $secondHeaderTH
            .simulate('mouseover')
            .simulate('mousemove', {
              clientY: $secondHeaderTH.offset().top,
            }); // Header "4"
            ;

          const $guideline = spec().$container.find('.ht__manualRowMove--guideline');

          expect($guideline.offset().top).toBe($secondHeaderTH.offset().top - 2);
        });

        it('should get correct position while grabing the row placed before hidden rows (moving up)', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            hiddenRows: {
              rows: [8, 9],
              indicators: true
            },
            manualRowMove: true,
          });

          const $firstHeaderTH = spec().$container.find('tbody tr:eq(2) th:eq(0)');
          const $secondHeaderTH = spec().$container.find('tbody tr:eq(3) th:eq(0)');

          $secondHeaderTH
            .simulate('mousedown')
            .simulate('mouseup')
            .simulate('mousedown')
            ; // Header "4"
          $firstHeaderTH
            .simulate('mouseover')
            .simulate('mousemove', {
              clientY: $firstHeaderTH.offset().top + $firstHeaderTH.height(),
            }); // Header "3"
            ;

          const $guideline = spec().$container.find('.ht__manualRowMove--guideline');

          expect($guideline.offset().top).toBe($firstHeaderTH.offset().top + $firstHeaderTH.height() - 1);
        });
      });
    });
  });
});
