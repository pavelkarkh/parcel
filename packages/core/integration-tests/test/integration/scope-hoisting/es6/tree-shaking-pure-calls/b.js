const Sum = /*#__PURE__*/function(){
    function Sum(x,y) {
        this.x = x;
        this.y = y;
    }
    Sum.prototype.calc = function(){
        return this.x + this.y;
    }
    return Sum;
}();

const Product = /*#__PURE__*/function(){
    function Product(x,y) {
        this.x = x;
        this.y = y;
    }
    Product.prototype.calc = function(){
        return this.x * this.y;
    }
    return Product;
}();

export {Sum, Product};
