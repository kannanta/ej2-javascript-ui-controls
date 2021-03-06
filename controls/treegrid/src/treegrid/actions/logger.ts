import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base/treegrid';
import { Logger as GridLogger, Grid, IGrid, ItemDetails, detailLists, CheckOptions } from '@syncfusion/ej2-grids';

/**
 * Logger module for TreeGrid
 * @hidden
 */

const DOC_URL: string = 'https://ej2.syncfusion.com/documentation/treegrid';
const BASE_DOC_URL: string = 'https://ej2.syncfusion.com/documentation';
const WARNING: string = '[EJ2TreeGrid.Warning]';
const ERROR: string = '[EJ2TreeGrid.Error]';
const INFO: string = '[EJ2TreeGrid.Info]';

export interface TreeItemDetails {
  type: string;
  logType: string;
  message?: string;
  check: (args: Object, parent: TreeGrid) => CheckOptions;
  generateMessage: (args: Object, parent: TreeGrid, checkOptions?: Object) => string;
}


export class Logger extends GridLogger {

  constructor(parent: IGrid) {
    Grid.Inject(GridLogger);
    super(parent);
  }

  /**
   * For internal use only - Get the module name.
   * @private
   */
  public getModuleName(): string {
    return 'logger';
  }

  public log(types: string | string[], args: Object): void {
    if (!(types instanceof Array)) { types = [types]; }
    let type: string[] = (<string[]>types);
    for (let i: number = 0; i < type.length; i++) {
        let item: ItemDetails = detailLists[type[i]];
        let cOp: CheckOptions = item.check(args, this.parent);
        if (cOp.success) {
          let message: string = item.generateMessage(args, this.parent, cOp.options);
          message =  message.replace('EJ2Grid', 'EJ2TreeGrid');
          let index: number = message.indexOf('https');
          let gridurl: string = message.substring(index);
          if (type[i] === 'module_missing') {
            message = message.replace(gridurl, DOC_URL + '/modules');
          } else if (type[i] === 'primary_column_missing' || type[i] === 'selection_key_missing') {
            message = message.replace(gridurl, BASE_DOC_URL + '/api/treegrid/column/#isprimarykey');
          } else if (type[i] === 'grid_remote_edit') {
            message = message.replace(gridurl, DOC_URL + '/edit');
          } else if (type[i] === 'virtual_height') {
            message = message.replace(gridurl, DOC_URL + '/virtual');
          } else if (type[i] === 'check_datasource_columns') {
            message = message.replace(gridurl, DOC_URL + '/columns');
          } else if (type[i] === 'locale_missing') {
            message = message.replace(gridurl, DOC_URL + '/global-local/#localization');
          }
          console[item.logType](message);
        }
    }
  }

  public treeLog(types: string | string[], args: Object, treeGrid: TreeGrid): void {
    if (!(types instanceof Array)) { types = [types]; }
    let type: string[] = (<string[]>types);
    if (treeGrid.allowRowDragAndDrop) {
      this.log('primary_column_missing', args);
    }
    for (let i: number = 0; i < type.length; i++) {
      let item: TreeItemDetails = treeGridDetails[type[i]];
      let cOp: CheckOptions = item.check(args, treeGrid);
      if (cOp.success) {
        let message: string = item.generateMessage(args, treeGrid, cOp.options);
        console[item.logType](message);
      }
  }
  }

}

export const treeGridDetails: {[key: string]: TreeItemDetails} = {
  mapping_fields_missing: {
      type: 'mapping_fields_missing',
      logType: 'error',
      check(args: Object, parent: TreeGrid): CheckOptions {
        let opt: CheckOptions = { success: false };
        if ((isNullOrUndefined(parent.idMapping) && isNullOrUndefined(parent.childMapping)
           && isNullOrUndefined(parent.parentIdMapping)) ||
           (!isNullOrUndefined(parent.idMapping) && isNullOrUndefined(parent.parentIdMapping)) ||
           (isNullOrUndefined(parent.idMapping) && !isNullOrUndefined(parent.parentIdMapping))) {
             opt = { success: true };
           }
        return opt;
      },
      generateMessage(args: Object, parent: TreeGrid, field: Object): string {
        return ERROR + ':' + ' MAPPING FIELDS MISSING \n' + 'One of the following fields are missing which are ' +
               'required for the hierarchy relation of records in Tree Grid.\n' +
               '* childMapping\n' + '* idMapping\n' + '* parentIdMapping\n' +
               'Refer to the following documentation links for more details\n' +
                `${BASE_DOC_URL}/api/treegrid#childmapping` + '\n' +
                `${BASE_DOC_URL}/api/treegrid#idmapping` + '\n' +
                `${BASE_DOC_URL}/api/treegrid#$parentidmapping`;
      }
  },
};
