(define-data-var seller principal 'ST000000000000000000002AMW42H)
(define-data-var highest-bidder principal 'ST000000000000000000002AMW42H)
(define-data-var highest-bid uint u0)
(define-data-var auction-active bool false)

(define-public (start-auction (min-bid uint))
    (begin
        (if (is-eq min-bid u0)
            (err u105)
            (if (var-get auction-active)
                (err u101)
                (begin
                    (var-set seller tx-sender)
                    (var-set highest-bid min-bid)
                    (var-set highest-bidder 'ST000000000000000000002AMW42H)
                    (var-set auction-active true)
                    (ok true)
                )
            )
        )
    )
)

(define-public (place-bid (bid-amount uint))
    (begin
        (if (not (var-get auction-active))
            (err u102)
            (if (<= bid-amount (var-get highest-bid))
                (err u103)
                (begin
                    (try! (stx-transfer? bid-amount tx-sender (as-contract tx-sender)))
                    (var-set highest-bid bid-amount)
                    (var-set highest-bidder tx-sender)
                    (ok true)
                )
            )
        )
    )
)

(define-public (end-auction)
    (begin
        (if (not (var-get auction-active))
            (err u104)
            (if (is-eq tx-sender (var-get seller))
                (begin
                    (try! (stx-transfer? (var-get highest-bid) (as-contract tx-sender)
                        (var-get seller)
                    ))
                    (var-set auction-active false)
                    (ok {
                        winner: (var-get highest-bidder),
                        amount: (var-get highest-bid),
                    })
                )
                (err u403)
            )
        )
    )
)
(define-read-only (get-highest-bid)
  (ok (var-get highest-bid))
)

(define-read-only (get-highest-bidder)
  (ok (var-get highest-bidder))
)

