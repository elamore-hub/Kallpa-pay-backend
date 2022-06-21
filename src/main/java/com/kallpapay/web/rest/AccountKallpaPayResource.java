package com.kallpapay.web.rest;

import com.kallpapay.domain.AccountKallpaPay;
import com.kallpapay.repository.AccountKallpaPayRepository;
import com.kallpapay.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.kallpapay.domain.AccountKallpaPay}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccountKallpaPayResource {

    private final Logger log = LoggerFactory.getLogger(AccountKallpaPayResource.class);

    private static final String ENTITY_NAME = "accountKallpaPay";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccountKallpaPayRepository accountKallpaPayRepository;

    public AccountKallpaPayResource(AccountKallpaPayRepository accountKallpaPayRepository) {
        this.accountKallpaPayRepository = accountKallpaPayRepository;
    }

    /**
     * {@code POST  /account-kallpa-pays} : Create a new accountKallpaPay.
     *
     * @param accountKallpaPay the accountKallpaPay to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountKallpaPay, or with status {@code 400 (Bad Request)} if the accountKallpaPay has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/account-kallpa-pays")
    public ResponseEntity<AccountKallpaPay> createAccountKallpaPay(@RequestBody AccountKallpaPay accountKallpaPay)
        throws URISyntaxException {
        log.debug("REST request to save AccountKallpaPay : {}", accountKallpaPay);
        if (accountKallpaPay.getId() != null) {
            throw new BadRequestAlertException("A new accountKallpaPay cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountKallpaPay result = accountKallpaPayRepository.save(accountKallpaPay);
        return ResponseEntity
            .created(new URI("/api/account-kallpa-pays/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /account-kallpa-pays/:id} : Updates an existing accountKallpaPay.
     *
     * @param id the id of the accountKallpaPay to save.
     * @param accountKallpaPay the accountKallpaPay to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountKallpaPay,
     * or with status {@code 400 (Bad Request)} if the accountKallpaPay is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountKallpaPay couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/account-kallpa-pays/{id}")
    public ResponseEntity<AccountKallpaPay> updateAccountKallpaPay(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountKallpaPay accountKallpaPay
    ) throws URISyntaxException {
        log.debug("REST request to update AccountKallpaPay : {}, {}", id, accountKallpaPay);
        if (accountKallpaPay.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountKallpaPay.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountKallpaPayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AccountKallpaPay result = accountKallpaPayRepository.save(accountKallpaPay);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountKallpaPay.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /account-kallpa-pays/:id} : Partial updates given fields of an existing accountKallpaPay, field will ignore if it is null
     *
     * @param id the id of the accountKallpaPay to save.
     * @param accountKallpaPay the accountKallpaPay to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountKallpaPay,
     * or with status {@code 400 (Bad Request)} if the accountKallpaPay is not valid,
     * or with status {@code 404 (Not Found)} if the accountKallpaPay is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountKallpaPay couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/account-kallpa-pays/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AccountKallpaPay> partialUpdateAccountKallpaPay(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountKallpaPay accountKallpaPay
    ) throws URISyntaxException {
        log.debug("REST request to partial update AccountKallpaPay partially : {}, {}", id, accountKallpaPay);
        if (accountKallpaPay.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountKallpaPay.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountKallpaPayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AccountKallpaPay> result = accountKallpaPayRepository
            .findById(accountKallpaPay.getId())
            .map(existingAccountKallpaPay -> {
                if (accountKallpaPay.getExternalId() != null) {
                    existingAccountKallpaPay.setExternalId(accountKallpaPay.getExternalId());
                }
                if (accountKallpaPay.getNumber() != null) {
                    existingAccountKallpaPay.setNumber(accountKallpaPay.getNumber());
                }
                if (accountKallpaPay.getName() != null) {
                    existingAccountKallpaPay.setName(accountKallpaPay.getName());
                }
                if (accountKallpaPay.getCurrency() != null) {
                    existingAccountKallpaPay.setCurrency(accountKallpaPay.getCurrency());
                }
                if (accountKallpaPay.getStatus() != null) {
                    existingAccountKallpaPay.setStatus(accountKallpaPay.getStatus());
                }
                if (accountKallpaPay.getLanguage() != null) {
                    existingAccountKallpaPay.setLanguage(accountKallpaPay.getLanguage());
                }

                return existingAccountKallpaPay;
            })
            .map(accountKallpaPayRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountKallpaPay.getId().toString())
        );
    }

    /**
     * {@code GET  /account-kallpa-pays} : get all the accountKallpaPays.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accountKallpaPays in body.
     */
    @GetMapping("/account-kallpa-pays")
    public List<AccountKallpaPay> getAllAccountKallpaPays() {
        log.debug("REST request to get all AccountKallpaPays");
        return accountKallpaPayRepository.findAll();
    }

    /**
     * {@code GET  /account-kallpa-pays/:id} : get the "id" accountKallpaPay.
     *
     * @param id the id of the accountKallpaPay to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountKallpaPay, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/account-kallpa-pays/{id}")
    public ResponseEntity<AccountKallpaPay> getAccountKallpaPay(@PathVariable Long id) {
        log.debug("REST request to get AccountKallpaPay : {}", id);
        Optional<AccountKallpaPay> accountKallpaPay = accountKallpaPayRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountKallpaPay);
    }

    /**
     * {@code DELETE  /account-kallpa-pays/:id} : delete the "id" accountKallpaPay.
     *
     * @param id the id of the accountKallpaPay to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/account-kallpa-pays/{id}")
    public ResponseEntity<Void> deleteAccountKallpaPay(@PathVariable Long id) {
        log.debug("REST request to delete AccountKallpaPay : {}", id);
        accountKallpaPayRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
