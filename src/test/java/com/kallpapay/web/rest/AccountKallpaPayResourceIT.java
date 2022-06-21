package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.AccountKallpaPay;
import com.kallpapay.repository.AccountKallpaPayRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AccountKallpaPayResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountKallpaPayResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_LANGUAGE = "AAAAAAAAAA";
    private static final String UPDATED_LANGUAGE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/account-kallpa-pays";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccountKallpaPayRepository accountKallpaPayRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountKallpaPayMockMvc;

    private AccountKallpaPay accountKallpaPay;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountKallpaPay createEntity(EntityManager em) {
        AccountKallpaPay accountKallpaPay = new AccountKallpaPay()
            .externalId(DEFAULT_EXTERNAL_ID)
            .number(DEFAULT_NUMBER)
            .name(DEFAULT_NAME)
            .currency(DEFAULT_CURRENCY)
            .status(DEFAULT_STATUS)
            .language(DEFAULT_LANGUAGE);
        return accountKallpaPay;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountKallpaPay createUpdatedEntity(EntityManager em) {
        AccountKallpaPay accountKallpaPay = new AccountKallpaPay()
            .externalId(UPDATED_EXTERNAL_ID)
            .number(UPDATED_NUMBER)
            .name(UPDATED_NAME)
            .currency(UPDATED_CURRENCY)
            .status(UPDATED_STATUS)
            .language(UPDATED_LANGUAGE);
        return accountKallpaPay;
    }

    @BeforeEach
    public void initTest() {
        accountKallpaPay = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountKallpaPay() throws Exception {
        int databaseSizeBeforeCreate = accountKallpaPayRepository.findAll().size();
        // Create the AccountKallpaPay
        restAccountKallpaPayMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isCreated());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeCreate + 1);
        AccountKallpaPay testAccountKallpaPay = accountKallpaPayList.get(accountKallpaPayList.size() - 1);
        assertThat(testAccountKallpaPay.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testAccountKallpaPay.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testAccountKallpaPay.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAccountKallpaPay.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testAccountKallpaPay.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testAccountKallpaPay.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
    }

    @Test
    @Transactional
    void createAccountKallpaPayWithExistingId() throws Exception {
        // Create the AccountKallpaPay with an existing ID
        accountKallpaPay.setId(1L);

        int databaseSizeBeforeCreate = accountKallpaPayRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountKallpaPayMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountKallpaPays() throws Exception {
        // Initialize the database
        accountKallpaPayRepository.saveAndFlush(accountKallpaPay);

        // Get all the accountKallpaPayList
        restAccountKallpaPayMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountKallpaPay.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE)));
    }

    @Test
    @Transactional
    void getAccountKallpaPay() throws Exception {
        // Initialize the database
        accountKallpaPayRepository.saveAndFlush(accountKallpaPay);

        // Get the accountKallpaPay
        restAccountKallpaPayMockMvc
            .perform(get(ENTITY_API_URL_ID, accountKallpaPay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountKallpaPay.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE));
    }

    @Test
    @Transactional
    void getNonExistingAccountKallpaPay() throws Exception {
        // Get the accountKallpaPay
        restAccountKallpaPayMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAccountKallpaPay() throws Exception {
        // Initialize the database
        accountKallpaPayRepository.saveAndFlush(accountKallpaPay);

        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();

        // Update the accountKallpaPay
        AccountKallpaPay updatedAccountKallpaPay = accountKallpaPayRepository.findById(accountKallpaPay.getId()).get();
        // Disconnect from session so that the updates on updatedAccountKallpaPay are not directly saved in db
        em.detach(updatedAccountKallpaPay);
        updatedAccountKallpaPay
            .externalId(UPDATED_EXTERNAL_ID)
            .number(UPDATED_NUMBER)
            .name(UPDATED_NAME)
            .currency(UPDATED_CURRENCY)
            .status(UPDATED_STATUS)
            .language(UPDATED_LANGUAGE);

        restAccountKallpaPayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountKallpaPay.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountKallpaPay))
            )
            .andExpect(status().isOk());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
        AccountKallpaPay testAccountKallpaPay = accountKallpaPayList.get(accountKallpaPayList.size() - 1);
        assertThat(testAccountKallpaPay.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testAccountKallpaPay.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testAccountKallpaPay.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAccountKallpaPay.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testAccountKallpaPay.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testAccountKallpaPay.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    @Transactional
    void putNonExistingAccountKallpaPay() throws Exception {
        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();
        accountKallpaPay.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountKallpaPayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountKallpaPay.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountKallpaPay() throws Exception {
        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();
        accountKallpaPay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountKallpaPayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountKallpaPay() throws Exception {
        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();
        accountKallpaPay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountKallpaPayMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountKallpaPayWithPatch() throws Exception {
        // Initialize the database
        accountKallpaPayRepository.saveAndFlush(accountKallpaPay);

        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();

        // Update the accountKallpaPay using partial update
        AccountKallpaPay partialUpdatedAccountKallpaPay = new AccountKallpaPay();
        partialUpdatedAccountKallpaPay.setId(accountKallpaPay.getId());

        partialUpdatedAccountKallpaPay.name(UPDATED_NAME).language(UPDATED_LANGUAGE);

        restAccountKallpaPayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountKallpaPay.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountKallpaPay))
            )
            .andExpect(status().isOk());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
        AccountKallpaPay testAccountKallpaPay = accountKallpaPayList.get(accountKallpaPayList.size() - 1);
        assertThat(testAccountKallpaPay.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testAccountKallpaPay.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testAccountKallpaPay.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAccountKallpaPay.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testAccountKallpaPay.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testAccountKallpaPay.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    @Transactional
    void fullUpdateAccountKallpaPayWithPatch() throws Exception {
        // Initialize the database
        accountKallpaPayRepository.saveAndFlush(accountKallpaPay);

        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();

        // Update the accountKallpaPay using partial update
        AccountKallpaPay partialUpdatedAccountKallpaPay = new AccountKallpaPay();
        partialUpdatedAccountKallpaPay.setId(accountKallpaPay.getId());

        partialUpdatedAccountKallpaPay
            .externalId(UPDATED_EXTERNAL_ID)
            .number(UPDATED_NUMBER)
            .name(UPDATED_NAME)
            .currency(UPDATED_CURRENCY)
            .status(UPDATED_STATUS)
            .language(UPDATED_LANGUAGE);

        restAccountKallpaPayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountKallpaPay.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountKallpaPay))
            )
            .andExpect(status().isOk());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
        AccountKallpaPay testAccountKallpaPay = accountKallpaPayList.get(accountKallpaPayList.size() - 1);
        assertThat(testAccountKallpaPay.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testAccountKallpaPay.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testAccountKallpaPay.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAccountKallpaPay.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testAccountKallpaPay.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testAccountKallpaPay.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    @Transactional
    void patchNonExistingAccountKallpaPay() throws Exception {
        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();
        accountKallpaPay.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountKallpaPayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountKallpaPay.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountKallpaPay() throws Exception {
        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();
        accountKallpaPay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountKallpaPayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountKallpaPay() throws Exception {
        int databaseSizeBeforeUpdate = accountKallpaPayRepository.findAll().size();
        accountKallpaPay.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountKallpaPayMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountKallpaPay))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountKallpaPay in the database
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountKallpaPay() throws Exception {
        // Initialize the database
        accountKallpaPayRepository.saveAndFlush(accountKallpaPay);

        int databaseSizeBeforeDelete = accountKallpaPayRepository.findAll().size();

        // Delete the accountKallpaPay
        restAccountKallpaPayMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountKallpaPay.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AccountKallpaPay> accountKallpaPayList = accountKallpaPayRepository.findAll();
        assertThat(accountKallpaPayList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
