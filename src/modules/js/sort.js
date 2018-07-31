class sortRank {
    static swapn(array, left, right) {
        let rightValue = array[right]
        array[right] = array[left]
        array[left] = rightValue
    }
    static checkArray(array) {
        if (!array || array.length < 2) {
            return;
        }
    }
    static insertionPositive(array,arr) {
        this.checkArray(array);
        for (let i = 1; i < array.length; i++) {
            for (let j = i - 1; j >= 0 && array[j] > array[j + 1]; j--) {
                this.swap(array, j, j + 1);
                this.swap(arr,j,j+1)
            }
        }
        return arr;
    }
    static insertionNegative(array,arr) {
        this.checkArray(array);
        for (let i = 1; i < array.length; i++) {
            for (let j = i - 1; j >= 0 && array[j] < array[j + 1]; j--) {
                this.swap(array, j, j + 1);
                this.swap(arr,j,j+1)
            }
        }
        return arr;
    }
    static replaceArray(arr,type){
      let array = []
      if(type.direc === '+' && type.kind === 'time'){
         arr.forEach(item=>{
             array.push(Date.parse(item.createdAt))
         })
         return this.insertionPositive(array,arr)
      }else if(type.direc === '-' && type.kind === 'time'){
        arr.forEach(item=>{
            array.push(Date.parse(item.createdAt))
        })
        return this.insertionNegative(array,arr)
      }else if(type.direc === '+' && type.kind === 'star'){
        arr.forEach(item=>{
            array.push(+item.star)
        })
        return this.insertionPositive(array,arr)
      }else if(type.direc === '-' && type.kind === 'star'){
        arr.forEach(item=>{
            array.push(+item.star)
        })
        return this.insertionNegative(array,arr)
      }
    }
}
export default sortRank