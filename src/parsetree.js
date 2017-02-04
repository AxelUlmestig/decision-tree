const parseTree = node => input => {
    if(node.output) return node;
    if(parseFilter(node.filter)(input)) return parseTree(node.posChild)(input);
    return parseTree(node.negChild)(input);
}

const parseFilter = f => {
    const args = f.match(/\(([\s\S]+)\)\s{/)[1];
    const body = f.match(/{([\s\S]+)}$/)[1];
    return new Function(args, body);
}

/*
parseFilterArrow = f => {
    const args = f.match(/([\s\S]+)\s=>/)[1].replace(/[()]/g, ''); //(*) won't work for some reason...
    const body = 'return' + f.match(/=>([\s\S]*)/)[1];
    return new Function(args, body);
}
*/
    
module.exports = {
    parseTree: parseTree,
    parseFilter: parseFilter
}
