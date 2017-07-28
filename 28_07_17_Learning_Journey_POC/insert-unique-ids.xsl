<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <!-- identity transform -->
    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="tbody/row">
        <xsl:variable name="row" select="."/>
        <xsl:variable name="uniqueid" select="$row/entry[1]"/>
        <row>
            <xsl:attribute name="id" select="$uniqueid"/>
            <xsl:copy-of select="$row/entry"/>
        </row>
        
    </xsl:template>
    
</xsl:stylesheet>