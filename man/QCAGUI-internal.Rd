\name{QCAGUI-internal}

\alias{.onAttach}
\alias{asNumeric}
\alias{base3rows}
\alias{createChart}
\alias{createString}
\alias{deMorganLoop}
\alias{drawVenn}
\alias{eqmccLoop}
\alias{factor.function}
\alias{fuzzyand}
\alias{fuzzyor}
\alias{getBigList}
\alias{getNonChars}
\alias{getSolution}
\alias{insideBrackets}
\alias{negateValues}
\alias{outsideBrackets}
\alias{possibleNumeric}
\alias{prettyString}
\alias{prettyTable}
\alias{print.aE}
\alias{print.deMorgan}
\alias{print.fctr}
\alias{print.pic}
\alias{print.pof}
\alias{print.qca}
\alias{print.mqca}
\alias{print.sS}
\alias{print.tt}
\alias{removeDuplicates}
\alias{removeSingleStars}
\alias{rowDominance}
\alias{simplifyList}
\alias{solveBrackets}
\alias{sortVector}
\alias{sortMatrix}
\alias{splitstr}
\alias{splitBrackets}
\alias{splitMainComponents}
\alias{splitPluses}
\alias{splitStars}
\alias{splitTildas}
\alias{trimst}
\alias{uninstall}
\alias{verify.data}
\alias{verify.dir.exp}
\alias{verify.eqmcc}
\alias{verify.inf.test}
\alias{verify.qca}
\alias{verify.mqca}
\alias{verify.tt}
\alias{writePrimeimp}
\alias{writeSolution}


\alias{ib}

\title{Internal Functions}

\description{
  The above functions are internal in the QCAGUI package which are not designed to 
  be called directly by the user. All of them are used by the \code{eqmcc} function, 
  except \code{sortMatrix} which is used by \code{allExpressions}. The verification 
  and error messages have been moved to the internal functions \code{verify.data} 
  and \code{verify.tt}.
}

\keyword{internal}