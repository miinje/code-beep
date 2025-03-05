{
function findReturn(stmts) {
    let returns = [];

    for (let i = 0; i < stmts.length; i++) {
        let stmt = stmts[i];
        if (!stmt) continue;

        if (stmt.type === "return") {
            returns.push(stmt);
        } else if (stmt.type === "block" && stmt.stmts) {
            let r = findReturn(stmt.stmts);
            if (r.length > 0) {
                returns = returns.concat(r);
            }
        }
    }

    return returns.length > 0 ? returns : null;
  }
}


Start
 = FunctionDeclaration
 / FunctionExpression
 / ArrowFunctionExpression

FunctionDeclaration
  = "function" __ name:Identifier _ "(" _ params:ParameterList? _ ")" _ "{" _ body:Block _ "}" {
      return {
        type: "FunctionDeclaration",
        name: name,
        parameters: params ? params : [],
        return: body.ret ? body.ret : null
      };
  }

FunctionExpression
  = keyword:VariableKeyword _ name:Identifier _ "=" _ "function""(" _ params:ParameterList? _ ")" _ "{" _ body:Block _ "}" {
      return {
        type: "FunctionDeclaration",
        name: name,
        parameters: params ? params : [],
        return: body.ret ? body.ret : null
      };
  }

ArrowFunctionExpression
  = keyword:VariableKeyword __ name:Identifier __ "=" __ "("? __ params:ParameterList __ ")"? __ "=>" __ "{"? __ body:Block __ "}"? {
    let returnType = body.type === "Expression" ? "Expression" : "BlockStatement";
    return createAST("ArrowFunction", null, extractParameters(params), returnType, location().start.offset, location().end.offset);
  }

VariableKeyword
  = "var" { return "var"; }
  / "let" { return "let"; }
  / "const" { return "const"; }

ParameterList
  = head:Identifier tail:(_ "," _ Identifier)* {
      return [head].concat(tail.map(e => e[3]));
  }

Block
  = stmts:Statement* {
      return { ret: findReturn(stmts), stmts: stmts };
  }

Statement
  = ReturnStatement
  / BlockStatement
  / NestedFunction
  / OtherStatement

BlockStatement
  = "{" _ stmts:Statement* _ "}" {
      return { type: "block", stmts: stmts };
  }

ReturnStatement
  = "return" __ expr:ReturnExpr? _ ";"? {
      return { type: "return", value: expr, start: location().start.offset, end: location().end.offset };
  }

ReturnExpr
  = $((!";" .)+) { return text().trim(); }


NestedFunction
  = "function" __ ((! "{" .))* "{" (!"}" .)* "}" { return { type: "ignored" }; }

OtherStatement
  = $((!";" .)+) _ ";" { return { type: "ignored" }; }

Identifier
  = id:$([a-zA-Z_$][a-zA-Z0-9_$]*) {
      return { type: "Identifier", name: id, start: location().start.offset, end: location().end.offset };
  }

_ "whitespace"
  = [ \t\n\r]*

__ "whitespace (at least one)"
  = [ \t\n\r]+
