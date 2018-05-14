const fs = require('fs-extra');
const path = require('path');

function BemBuilderCore(input,ext){
    this.map = JSON.parse(fs.readFileSync(input,'utf8'));
    this.fs = fs;
    this.sep = path.sep;
    this.ext = ext;
    this.files = [];

    this.buildContent = function(blockName,elementName = null,modificatorName = null,imports = []){
        if(elementName === null){
            if(modificatorName === null){
                let template = '';
                if(imports.length > 0){
                    for(let i = 0;i<imports.length;i++){
                        //@import "__content-container/content-page__content-container";
                        template+= '@import "' + imports[i] + '";\n';
                    }
                }
                return template + '\n.' + blockName + ' {\n\t\n}'
            }else{
                return '.' + blockName +'_'+modificatorName+ ' {\n\t\n}';
            }
        }else {
            if(modificatorName === null) {
                return '.' + blockName + '__' + elementName + ' {\n\t\n}';
            }else {
                return '.' + blockName + '__' + elementName + '_' + modificatorName + ' {\n\t\n}';
            }
        }
    };

    this.parseMap = function(){
        const _self = this;
        this.map.blocks.forEach(function (item) {
            _self.parseBlock(item);
        });
        return this;
    };
    this.parseBlock = function(block){
        const _self = this;
        if(typeof block === "string"){
            this.files.push(new BemFile(block,block + '.' + this.ext, this.buildContent(block)));
        }else if(typeof block === "object"){
            let imports = [];
            if(block.hasOwnProperty('elements')){
                block.elements.forEach(function (item) {
                    imports = imports.concat(_self.parseElement(item,block.name));
                });
            }
            if(block.hasOwnProperty('modificators')){
                block.modificators.forEach(function (item) {
                    imports = imports.concat(_self.parseModificator(item,block.name));
                });
            }
            this.files.push(new BemFile(block.name,block.name + '.' + this.ext,this.buildContent(block.name,null,null,imports)));
        }
    };
    this.parseElement = function(element,blockName){
        const _self = this;
        let imports = [];
        if(typeof element === "string"){
            this.files.push(new BemFile(blockName + this.sep+"__" + element,blockName+'__' + element + '.' + this.ext,this.buildContent(blockName,element)))
            imports.push("__" + element + "/" + blockName + "__" +element);
        }else if(typeof element === "object"){
            this.files.push(
                new BemFile(
                    blockName + this.sep+"__" + element.name,
                    blockName+'__' + element.name + '.' + this.ext,
                    this.buildContent(blockName,element.name)
                )
            );
            if(element.hasOwnProperty('modificators')){
                element.modificators.forEach(function (item) {
                    imports = imports.concat(_self.parseModificator(item,blockName,element.name));
                });
            }
            imports.push("__" + element.name + "/" + blockName + "__" + element.name);
        }
        return imports;
    };
    this.parseModificator = function(modificator,blockName,elementName = null){
        const _self = this;
        let imports = [];
        if(typeof modificator === "string"){
            if(elementName === null){
                this.files.push(
                    new BemFile(
                        blockName+this.sep+'_'+modificator,
                        blockName+'_'+modificator+'.'+this.ext,
                        this.buildContent(blockName,null,modificator)
                    )
                );
                imports.push("_" + modificator + "/" + blockName + "_" + modificator);
            }else{
                this.files.push(
                    new BemFile(
                        blockName+this.sep+'__'+elementName+this.sep+'_'+modificator,
                        blockName+'__'+elementName+'_'+modificator+'.'+ this.ext,
                        this.buildContent(blockName,elementName,modificator)
                    )
                );
                imports.push("__" + elementName+"/_" + modificator + "/" + blockName + "__" + elementName + "_" + modificator);
            }
        }else if(typeof modificator === "object"){
            modificator.items.forEach(function (item) {
                imports = imports.concat(_self.parseModificatorGroup(modificator.group,item,blockName,elementName));
            })
        }
        return imports;
    };
    this.parseModificatorGroup = function(group,modificatorName,blockName,elementName = null){
        let imports = [];
        if(elementName === null){
            this.files.push(
                new BemFile(
                    blockName + this.sep+'_'+group,
                    blockName+'_'+group+'_'+modificatorName+'.'+this.ext,
                    this.buildContent(blockName,elementName,group+'_'+modificatorName)
                )

            );
            imports.push("_" + group + "/" + blockName + "_" + group + "_" + modificatorName);
        }else{
            this.files.push(
                new BemFile(
                    blockName+this.sep+'__'+elementName+this.sep+'_'+group,
                    blockName+'_'+group+'_'+modificatorName+'.'+this.ext,
                    this.buildContent(blockName,elementName,group+'_'+modificatorName)
                )
            );
            imports.push("__"+ elementName + "/_" + group + "/" + blockName + "__" + elementName + "_" + group + "_" + modificatorName);
        }
        return imports;
    };
    this.write = function(output = null){
        const _self = this;
        let outputDir = output === null?process.cwd() + this.sep +'bem.blocks':path(output);
        this.files.forEach(function (file) {
            _self.fs.ensureDirSync(outputDir + _self.sep + file.path);
            _self.fs.appendFile(outputDir + _self.sep + file.path + _self.sep + file.name, file.content, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        })
    }
}
function BemFile(path,name,content){
     this.path = path;
     this.name = name;
     this.content = content;
}
module.exports = BemBuilderCore;