describe('Response format / styling', () => {
    it('json response', () => {
        cy.api({
            url: '/json'
        }).then(response => {
            expect(response.body).to.be.deep.eq({
                "string": "string",
                "int": 1234,
                "object": {
                    "array": [
                        1,
                        2
                    ]
                }
            })
        })
    })

    it('theme color vs', () => {
        cy.api({
            url: '/json'
        })
        // red
        cy.get('.cy-api-response > .hljs > :nth-child(2)')
            .should('have.css', 'color', 'rgb(255, 0, 0)');
        // brown
        cy.get('.cy-api-response > .hljs > .hljs-string')
            .should('have.css', 'color', 'rgb(163, 21, 21)');
        // black
        cy.get(':nth-child(8)')
            .should('have.css', 'color', 'rgb(0, 0, 0)');
    })

})