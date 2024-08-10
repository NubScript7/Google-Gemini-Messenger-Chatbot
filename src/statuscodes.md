## HTTP Status Codes and their Meanings:

HTTP status codes are grouped into five classes:

**1xx: Informational**

* **100 Continue:** The server has received the request headers and the client should proceed to send the request body.
* **101 Switching Protocols:** The server is switching protocols as requested by the client.
* **102 Processing (WebDAV):** The server has received and is processing the request, but no response is available yet.
* **103 Early Hints:** Used to return some response headers before final HTTP message.

**2xx: Success**

* **200 OK:** The request has succeeded.
* **201 Created:** The request has succeeded and a new resource has been created as a result.
* **202 Accepted:** The request has been accepted for processing, but the processing has not been completed.
* **203 Non-Authoritative Information:** The server is a transforming proxy (e.g. a web cache) that received a 200 OK from its origin, but is returning a modified version of the origin's response.
* **204 No Content:** The server successfully processed the request and is not returning any content.
* **205 Reset Content:** The server successfully processed the request, but is not returning any content. The client should reset the document view.
* **206 Partial Content:** The server is delivering only part of the resource (byte serving) due to a range header sent by the client.
* **207 Multi-Status (WebDAV):** The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.
* **208 Already Reported (WebDAV):** The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.
* **226 IM Used:** The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.

**3xx: Redirection**

* **300 Multiple Choices:** Indicates multiple options for the resource from which the client may choose (via agent-driven content negotiation). 
* **301 Moved Permanently:** The requested resource has been permanently moved to a new location. The client should update its bookmarks and links.
* **302 Found:** The requested resource has been temporarily moved to a new location. The client should continue to use the original URI for future requests.
* **303 See Other:** The response to the request can be found under another URI using a GET method. 
* **304 Not Modified:** Indicates since last request, the resource has not been modified. 
* **305 Use Proxy:** The requested resource must be accessed through the proxy given by the Location field header. 
* **306 (Unused):** This code was used in a previous version. It is no longer used, but the code is reserved.
* **307 Temporary Redirect:** The requested resource has been temporarily moved to another location. The client should continue to use the original URI for future requests.
* **308 Permanent Redirect (experimental):** The request and all future requests should be repeated using another URI.

**4xx: Client Error**

* **400 Bad Request:** The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
* **401 Unauthorized:**  Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
* **402 Payment Required:**  Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, as proposed, for example, by the original HTTP specification, but that has yet to happen, and this code is not usually used.
* **403 Forbidden:** The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. 
* **404 Not Found:** The server can notfind the requested resource. 
* **405 Method Not Allowed:** A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.
* **406 Not Acceptable:** The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
* **407 Proxy Authentication Required:** The client must first authenticate itself with the proxy.
* **408 Request Timeout:** The server timed out waiting for the request.
* **409 Conflict:** Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.
* **410 Gone:** Indicates that the resource requested is no longer available and will not be available again. 
* **411 Length Required:** The request did not specify the length of its content, which the resource requires.
* **412 Precondition Failed:** The server does not meet one of the preconditions that the requester put on the request header fields.
* **413 Payload Too Large:** Request entity is larger than limits defined by server.
* **414 URI Too Long:** The URI provided was too long for the server to process. 
* **415 Unsupported Media Type:** The request entity has a media type which the server or resource does not support. 
* **416 Range Not Satisfiable:** The client has asked for a portion of the file (byte serving), but the server cannot supply that portion. 
* **417 Expectation Failed:** The server cannot meet the requirements of the Expect request-header field.
* **418 I'm a teapot:** This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. 
* **421 Misdirected Request:** The request was directed at a server that is not able to produce a response (for example because a connection reuse).
* **422 Unprocessable Entity (WebDAV; RFC 4918):** The request was well-formed but was unable to be followed due to semantic errors.
* **423 Locked (WebDAV; RFC 4918):** The resource that is being accessed is locked.
* **424 Failed Dependency (WebDAV; RFC 4918):** The request failed due to failure of a previous request (e.g., a PROPPATCH).
* **425 Too Early:** Indicates that the server is unwilling to risk processing a request that might be replayed.
* **426 Upgrade Required:** The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.
* **428 Precondition Required:** The origin server requires the request to be conditional. 
* **429 Too Many Requests:** The user has sent too many requests in a given amount of time ("rate limiting").
* **431 Request Header Fields Too Large:** The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.
* **451 Unavailable For Legal Reasons:** A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource. 

**5xx: Server Error**

* **500 Internal Server Error:**  A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
* **501 Not Implemented:** The server either does not recognize the request method, or it lacks the ability to fulfil the request. 
* **502 Bad Gateway:** The server was acting as a gateway or proxy and received an invalid response from the upstream server.
* **503 Service Unavailable:** The server cannot handle the request (because it is overloaded or down for maintenance). 
* **504 Gateway Timeout:** The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
* **505 HTTP Version Not Supported:** The server does not support the HTTP protocol version used in the request.
* **506 Variant Also Negotiates:** Transparent content negotiation for the request results in a circular reference.
* **507 Insufficient Storage (WebDAV; RFC 4918):** The server is unable to store the representation needed to complete the request.
* **508 Loop Detected (WebDAV; RFC 5842):** The server detected an infinite loop while processing the request (sent in lieu of 208 Already Reported).
* **510 Not Extended:** Further extensions to the request are required for the server to fulfil it.
* **511 Network Authentication Required:**  The client needs to authenticate to gain network access.

This list covers the most common HTTP status codes. You can find more detailed information about each status code, along with less common ones, in the official HTTP specification: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html