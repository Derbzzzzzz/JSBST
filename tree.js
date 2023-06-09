class Tree{
    constructor(array){
        this.root = this.buildTree(array)
    }

    buildTree(array){
        /* .sort takes function and places 
        a in front of b if a - b is less than 0 
        (aka if a is smaller than b) */
        array.sort(function(a,b){
            return a - b
        })

        for (let index = 0; index < array.length; index++) {
            if(index != array.indexOf(array[index])){
                array.splice(index, 1)
                index -= 1
            }  
        }



        return this.sortedArraytoBST(array, 0, array.length - 1)

    }

    sortedArraytoBST(arr, start, end){
        if (start > end){
            return null
        }

        let mid = parseInt((start + end) / 2)
        let node = new Node(arr[mid])

        node.left = this.sortedArraytoBST(arr, start, mid - 1)
        node.right = this.sortedArraytoBST(arr, mid + 1, end)

        return node
    }

    insert(val){
        let temp = this.root
        let node = new Node(val)

        while(1){
            if(temp.val == val){
                return "Can't insert duplicate value";
            } else if(temp.val > val){
                if(temp.left == null){
                    temp.left = node
                    return
                } else{
                    temp = temp.left
                }
            } else{
                if(temp.right == null){
                    temp.right = node
                    return
                } else{
                    temp = temp.right
                }
            }
        }
    }

    delete(val, root = this.root){
        if(root == null){
            return root
        }

        /* Else statement only runs if value is found*/
        if (root.val > val){
            root.left = this.delete(val, root.left)
        } else if (root.val < val){
            root.right = this.delete(val, root.right)
        } else {
            /* If...else if checks if 
            root has one or no children 
            (eliminating need to find in order sucessor) */
            if(root.left == null){
                return root.right
            } else if(root.right == null){
                return root.left
            }

            /* Find in order sucessor, 
            then replace root with it
            and delete it*/
            root.val = this.#minValue(root.right)

            this.delete(root.val, root.right)
        }

        return root
    }

    #minValue(root){
        while(root.left != null){
            root = root.left
        }

        return root.val
    }

    find(val, root = this.root){
        if(root == null){
            return null
        }

        if(root.val == val){
            return root
        } else if(root.val > val){
            return this.find(val, root.left)
        } else{
            return this.find(val, root.right)
        }
    }

    levelOrder(callback){

        let queue = [this.root]
        let results = []
        while(queue.length != 0){

            let size = queue.length
            for (let i = 0; i < size; i++) {
                let node = queue.shift()
                results.push(node.val)
                if (node.left != null) queue.push(node.left)
                if (node.right != null) queue.push(node.right)
                if (callback) callback(node)
            }
        }

        return results
    }

    inOrder(callback, node = this.root, arr = []){
        if(node == null){
            return
        }

        this.inOrder(callback, node.left, arr)

        if (callback) callback(node)
        arr.push(node)

        this.inOrder(callback, node.right, arr)

        return arr

    }

    preOrder(callback, node = this.root, arr = []){
        if(node == null){
            return
        }

        if (callback) callback(node)
        arr.push(node)

        this.preOrder(callback, node.left, arr)

        this.preOrder(callback, node.right, arr)

        return arr

    }

    postOrder(callback, node = this.root, arr = []){
        if(node == null) return

        this.postOrder(callback, node.left, arr)

        this.postOrder(callback, node.right, arr)

        if (callback) callback(node)
        arr.push(node)

        return arr

    }

    height(node){
        let queue = [node]
        let height = -1

        while(queue.length != 0){
            let size = queue.length
            for(let i = 0; i < size; i++){
                let temp = queue.shift()
                if(temp.left != null) queue.push(temp.left)
                if(temp.right != null) queue.push(temp.right)
            }

            height++
        }

        return height
    }

    depth(node){
        let queue = [this.root]
        let height = 0

        while(queue.length != 0){
            let size = queue.length
            for(let i = 0; i < size; i++){
                let temp = queue.shift()
                if(temp == node) return height
                if(temp.left != null) queue.push(temp.left)
                if(temp.right != null) queue.push(temp.right)
            }

            height++
        }

        return -1
    }

    isBalanced(){
        let queue = [this.root]
        let bigHeight = this.height(this.root)
        let smallHeight = 0

        outer_loop:
        while(queue.length != 0){
            let size = queue.length

            for(let i = 0; i < size; i++){
                let temp = queue.shift()
                if(temp.left != null) queue.push(temp.left)
                else break outer_loop;
                if(temp.right != null) queue.push(temp.right)
                else break outer_loop;
            }

            smallHeight++
        }

        return (bigHeight - smallHeight) <= 1
    }

    rebalance(){
        let nodeArr = this.inOrder()
        let arr = []
        
        for(let i = 0; i < nodeArr.length; i++){
            arr.push(nodeArr[i].val)
        }

        this.root = this.buildTree(arr)
    }

}

class Node{
    constructor(data){
        this.val = data
        this.left = null
        this.right = null
    }
}

// let myTree = new Tree([1, -200, 7, 97, 23, -2, 9, -18, 3, 5, 7, 9, 67, 6345, 324])

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.val}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

function printNode(node){
    console.log("Val: " + node.val.toString())
}

const randomArray = (size) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
};

let myTree = new Tree(randomArray(30))

prettyPrint(myTree.root)
console.log("Balanced: ", myTree.isBalanced()) // True
console.log("LevelOrder: ", myTree.levelOrder())
console.log("PreOrder: ", myTree.preOrder())
console.log("PostOrder: ", myTree.postOrder())
console.log("InOrder: ", myTree.inOrder())

let random = randomArray(30)

random.forEach(function(val){
    myTree.insert(val)
})

console.log("Balanced: ", myTree.isBalanced()) // False
myTree.rebalance()
console.log("Balanced: ", myTree.isBalanced()) // True
console.log("LevelOrder: ", myTree.levelOrder())
console.log("PreOrder: ", myTree.preOrder())
console.log("PostOrder: ", myTree.postOrder())
console.log("InOrder: ", myTree.inOrder())





