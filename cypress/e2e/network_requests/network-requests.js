/// <reference types="cypress" />

describe('Network Requests', () => {
    let errorMessage = "Unable to find comment!"

    beforeEach(() => {
        cy.visit("https://example.cypress.io/commands/network-requests");
    })

    it('Get Request', () => {
        cy.intercept({
            method: "GET",
            url: "**/comments/*",
        },
            {
                body: {                 // Mocking the response
                    postID: 1,
                    id: 1,
                    name: "George",
                    email: "Geo@gmail.com",
                    body: "This is a test!"
                }

            }).as("getComment");

        cy.get(".network-btn").click();

        cy.wait("@getComment").its("response.statusCode").should("eq", 200);
    });

    it('Post Request', () => {
        cy.intercept("POST", "/comments").as("postComment");

        cy.get(".network-post").click();

        cy.wait("@postComment").should(({ request, response }) => {
            console.log(request);
            expect(request.body).to.include("email");
            console.log(response);
            expect(response.body).to.have.property("name", "Using POST in cy.intercept()");

            expect(request.headers).to.have.property("content-type");
            expect(request.headers).to.have.property("origin", "https://example.cypress.io");
        })
    });

    it('PUT Request', () => {
        cy.intercept({
            method:"PUT",
            url:"**/comments/*"
        },
        {   // mocking server response to get status code 404
            statusCode: 404,
            body: {error: errorMessage},
            delay: 500
        }).as("putComment");

        cy.get(".network-put").click();

        cy.wait("@putComment")

        // assert configured error message is displayed
        cy.get('.network-put-comment').should('contain', errorMessage)  
    });
});