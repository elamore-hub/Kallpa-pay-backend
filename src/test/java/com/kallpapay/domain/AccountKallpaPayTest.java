package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountKallpaPayTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountKallpaPay.class);
        AccountKallpaPay accountKallpaPay1 = new AccountKallpaPay();
        accountKallpaPay1.setId(1L);
        AccountKallpaPay accountKallpaPay2 = new AccountKallpaPay();
        accountKallpaPay2.setId(accountKallpaPay1.getId());
        assertThat(accountKallpaPay1).isEqualTo(accountKallpaPay2);
        accountKallpaPay2.setId(2L);
        assertThat(accountKallpaPay1).isNotEqualTo(accountKallpaPay2);
        accountKallpaPay1.setId(null);
        assertThat(accountKallpaPay1).isNotEqualTo(accountKallpaPay2);
    }
}
