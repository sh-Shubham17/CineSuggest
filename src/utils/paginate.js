import _ from 'lodash';

export function paginate( items, pageNumber, pageSize )
{
    const startIndex = (pageNumber - 1)* pageSize;
    return _(items).slice(startIndex).take(pageSize).value() ;
    //_(items) to convert array to lodash object
    // _.slice(items, startIndex) : all array items from startindex but require lodash object so 
    // _.take(size) take specified(size) number of elements from lodash obj
    //_.valu() to convert back lodash object to array
     
}