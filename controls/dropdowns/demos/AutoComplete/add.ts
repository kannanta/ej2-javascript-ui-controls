/**
 * AutoComplete AddItem Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';
import { Button } from '@syncfusion/ej2-buttons';

let empList: { [key: string]: Object }[] = [
    { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
    { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
    { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
    { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
    { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
];

let listObj: AutoComplete = new AutoComplete({
    dataSource: empList,
    value: 'Football',
    fields: { value: 'sports' },
    sortOrder: 'Ascending',
    width: '250px',
    popupHeight: '200px',
    popupWidth: '250px',
    allowCustom: true
});
listObj.appendTo('#list');
let button: Button = new Button();
button.appendTo('#btn');

let buttons: Button = new Button();
buttons.appendTo('#btn1');

let button1: HTMLElement = <HTMLElement>document.getElementById('btn');
button1.onclick = () => {
    listObj.addItem({ id: 'level11', sports: 'Kabadi' });
};
let button2: HTMLElement = <HTMLElement>document.getElementById('btn1');
button2.onclick = () => {
    listObj.addItem({ id: 'level11', sports: 'Swimming' }, 2);
};