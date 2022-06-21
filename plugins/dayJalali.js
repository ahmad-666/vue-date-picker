import jalaliday from 'jalaliday';
export default ({ $dayjs }) => {
    $dayjs.extend(jalaliday).calendar('jalali')
    // inject('dayjsJalali',)
}